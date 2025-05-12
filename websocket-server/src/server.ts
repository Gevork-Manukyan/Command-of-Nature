import { createServer } from "http"; 
import { Server } from "socket.io";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import gamesRouter from "./routes/games";
import { PORT, processEventMiddleware, socketErrorHandler } from "./lib";
import { GameEventEmitter, GameStateManager, ValidationError, InvalidSpaceError } from "./services";
import { AllSpaceOptionsSchema, CancelSetupData, ChoseWarriorsData, ClearTeamsData, CreateGameData, PlayerFinishedSetupData, JoinGameData, JoinTeamData, LeaveGameData, SelectSageData, SocketEventMap, StartGameData, SwapWarriorsData, ToggleReadyStatusData, AllPlayersSetupData, AllSagesSelectedData, ActivateDayBreakData, GetDayBreakCardsData, ExitGameData, RejoinGameData, AllTeamsJoinedData,ActivateDayBreakEvent, AllPlayersSetupEvent, AllSagesSelectedEvent, AllTeamsJoinedEvent, CancelSetupEvent, ChoseWarriorsEvent, ClearTeamsEvent, CreateGameEvent, DebugEvent, ExitGameEvent, GameListing, GetDayBreakCardsEvent, JoinGameEvent, JoinTeamEvent, LeaveGameEvent, PlayerFinishedSetupEvent, RejoinGameEvent, SelectSageEvent, StartGameEvent, SwapWarriorsEvent, ToggleReadyStatusEvent } from "@shared-types";

const app = express();
app.use(cors());
app.use(express.json());

// Add API routes
app.use('/api/games', gamesRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");

// Initialize services
const gameEventEmitter = GameEventEmitter.getInstance(gameNamespace);
const gameStateManager = GameStateManager.getInstance();

gameNamespace.on("connection", (socket) => {

  /* -------- MIDDLEWARE -------- */
  socket.use(([event, rawData], next) => {
    processEventMiddleware(socket, event as keyof SocketEventMap, rawData, next)
  });

  socket.on("error", (error: Error) => {
    console.error("Socket error:", error);
  });

  /* -------- GAME SETUP -------- */
  // TODO: some events should emit to all players that something happened

  // TODO: FOR DEBUGING
  socket.on(DebugEvent, socketErrorHandler(socket, DebugEvent, async () => {
    socket.emit("debug", gameStateManager);
  }));

  socket.on(CreateGameEvent, socketErrorHandler(socket, CreateGameEvent, async ({ userId, numPlayers, gameName, isPrivate, password }: CreateGameData) => {      
      const { game } = await gameStateManager.createGame(numPlayers, gameName, isPrivate, password || '');
      gameStateManager.playerJoinGame(userId, socket.id, game.id, true, password);
      const gameListing: GameListing = {
        id: game.id,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length,
      }

      socket.join(game.id);
      socket.emit(`${CreateGameEvent}--success`, gameListing);
  }));

  socket.on(JoinGameEvent, socketErrorHandler(socket, JoinGameEvent, async ({ userId, gameId, password }: JoinGameData) => {
    gameStateManager.verifyJoinGameEvent(gameId);
    await gameStateManager.playerJoinGame(userId, socket.id, gameId, false, password);
    gameStateManager.processJoinGameEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const gameListing: GameListing = {
      id: gameId,
      gameName: game.gameName,
      isPrivate: game.isPrivate,
      numPlayersTotal: game.numPlayersTotal,
      numCurrentPlayers: game.players.length,
    }
    
    socket.join(gameId);
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, "player-joined", { userId });
    socket.emit(`${JoinGameEvent}--success`, gameListing);
  }));

  socket.on(SelectSageEvent, socketErrorHandler(socket, SelectSageEvent, async ({ gameId, sage }: SelectSageData) => {
    gameStateManager.verifySelectSageEvent(gameId);
    gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
    gameStateManager.processSelectSageEvent(gameId);

    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, `sage-selected`, { sage });
    socket.emit(`${SelectSageEvent}--success`);
  }));

  socket.on(AllSagesSelectedEvent, socketErrorHandler(socket, AllSagesSelectedEvent, async ({ gameId }: AllSagesSelectedData) => {
    gameStateManager.verifyAllSagesSelectedEvent(gameId);
    await gameStateManager.allPlayersSelectedSage(gameId);
    gameStateManager.processAllSagesSelectedEvent(gameId);

    gameEventEmitter.emitToAllPlayers(gameId, `${AllSagesSelectedEvent}--success`);
  }));

  socket.on(JoinTeamEvent, socketErrorHandler(socket, JoinTeamEvent, async ({ gameId, team }: JoinTeamData) => {
    gameStateManager.verifyJoinTeamEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    game.joinTeam(socket.id, team);
    gameStateManager.processJoinTeamEvent(gameId);
    
    const player = game.getPlayer(socket.id);
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, "team-joined", { id: player.userId, team });
    socket.emit(`${JoinTeamEvent}--success`);
  }));

  socket.on(ClearTeamsEvent, socketErrorHandler(socket, ClearTeamsEvent, async ({ gameId }: ClearTeamsData) => {
    gameStateManager.verifyClearTeamsEvent(gameId);
    gameStateManager.getGame(gameId).clearTeams();
    gameStateManager.processClearTeamsEvent(gameId);

    gameEventEmitter.emitToAllPlayers(gameId, `${ClearTeamsEvent}--success`);
  }));

  socket.on(AllTeamsJoinedEvent, socketErrorHandler(socket, AllTeamsJoinedEvent, async ({ gameId }: AllTeamsJoinedData) => {
    gameStateManager.verifyAllTeamsJoinedEvent(gameId);
    await gameStateManager.allTeamsJoined(gameId);
    gameStateManager.processAllTeamsJoinedEvent(gameId);

    gameEventEmitter.emitToAllPlayers(gameId, `${AllTeamsJoinedEvent}--success`);
  }));

  socket.on(ToggleReadyStatusEvent, socketErrorHandler(socket, ToggleReadyStatusEvent, async ({ gameId }: ToggleReadyStatusData) => {
    gameStateManager.verifyToggleReadyStatusEvent(gameId);
    const isReady = gameStateManager.toggleReadyStatus(gameId, socket.id);
    gameStateManager.processToggleReadyStatusEvent(gameId);

    const player = gameStateManager.getGame(gameId).getPlayer(socket.id);
    const eventName = isReady ? "ready-status--ready" : "ready-status--not-ready";
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, eventName, { id: player.userId, isReady });
    socket.emit(eventName);
  }));

  socket.on(StartGameEvent, socketErrorHandler(socket, StartGameEvent, async ({ gameId }: StartGameData) => {
    gameStateManager.verifyAllPlayersReadyEvent(gameId);
    await gameStateManager.startGame(gameId);
    gameStateManager.processAllPlayersReadyEvent(gameId);
    
    gameEventEmitter.emitPickWarriors(gameId);
    socket.emit(`${StartGameEvent}--success`);
  }));

  // Test
  socket.on(ChoseWarriorsEvent, socketErrorHandler(socket, ChoseWarriorsEvent, async ({ gameId, choices }: ChoseWarriorsData) => {
    gameStateManager.verifyChooseWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.userId).chooseWarriors(player, choices);
    gameStateManager.processChooseWarriorsEvent(gameId);
    socket.emit(`${ChoseWarriorsEvent}--success`)
  }));

  socket.on(SwapWarriorsEvent, socketErrorHandler(socket, SwapWarriorsEvent, async ({ gameId }: SwapWarriorsData) => {
    gameStateManager.verifySwapWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.userId).swapWarriors(player);
    gameStateManager.processSwapWarriorsEvent(gameId);
    socket.emit(`${SwapWarriorsEvent}--success`)
  }));

  socket.on(PlayerFinishedSetupEvent, socketErrorHandler(socket, PlayerFinishedSetupEvent, async ({ gameId }: PlayerFinishedSetupData) => {
    gameStateManager.verifyFinishedSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    game.getPlayer(socket.id).finishPlayerSetup();
    game.incrementPlayersFinishedSetup();
    gameStateManager.processFinishedSetupEvent(gameId);
    socket.emit(`${PlayerFinishedSetupEvent}--success`)
  }));

  socket.on(CancelSetupEvent, socketErrorHandler(socket, CancelSetupEvent, async ({ gameId }: CancelSetupData) => {
    gameStateManager.verifyCancelSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId)
    game.getPlayer(socket.id).cancelPlayerSetup();
    game.decrementPlayersFinishedSetup();
    gameStateManager.processCancelSetupEvent(gameId);
    socket.emit(`${CancelSetupEvent}--success`)
  }))

  socket.on(AllPlayersSetupEvent, socketErrorHandler(socket, AllPlayersSetupEvent, async ({ gameId }: AllPlayersSetupData) => {
    gameStateManager.verifyAllPlayersSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    if (game.numPlayersFinishedSetup !== game.players.length) throw new ValidationError("All players have not finished setup", "players");
    const activeGame = gameStateManager.beginBattle(game);
    gameStateManager.processAllPlayersSetupEvent(gameId);
    gameEventEmitter.emitStartTurn(activeGame.getActiveTeamPlayers(), activeGame.getWaitingTeamPlayers());
    socket.emit(`${AllPlayersSetupEvent}--success`);
  }));

  /**
   * Save and exit the game for everyone
   */
  socket.on(ExitGameEvent, socketErrorHandler(socket, ExitGameEvent, async ({ gameId }: ExitGameData) => {
    socket.leave(gameId);
    socket.emit(`${ExitGameEvent}--success`);
  }));

  /**
   * Rejoin the game after disconnecting or exiting
   */
  socket.on(RejoinGameEvent, socketErrorHandler(socket, RejoinGameEvent, async ({ gameId, userId }: RejoinGameData) => {
    await gameStateManager.playerRejoinedGame(gameId, userId, socket.id);
    socket.join(gameId);
    socket.emit(`${RejoinGameEvent}--success`);
    gameEventEmitter.emitToAllPlayers(gameId, "player-rejoined", { userId });
  }));

  /**
   * Leave the game
   */
  // TODO: How to handle if someone leaves the game midway through?
  socket.on(LeaveGameEvent, socketErrorHandler(socket, LeaveGameEvent, async ({ gameId }: LeaveGameData) => {
    await gameStateManager.removePlayerFromGame(gameId, socket.id);
    socket.leave(gameId);
    socket.emit(`${LeaveGameEvent}--success`);
  }));

  /* -------- GAME BATTLING -------- */
  socket.on(GetDayBreakCardsEvent, socketErrorHandler(socket, GetDayBreakCardsEvent, async ({ gameId }: GetDayBreakCardsData) => {
    gameStateManager.verifyGetDayBreakCardsEvent(gameId);
    const game = gameStateManager.getActiveGame(gameId);
    const dayBreakCards = game.getDayBreakCards(socket.id);
    gameStateManager.processGetDayBreakCardsEvent(gameId);
    gameEventEmitter.emitToPlayers(game.getActiveTeamPlayers(), "day-break-cards", dayBreakCards);
  }));

  socket.on(ActivateDayBreakEvent, socketErrorHandler(socket, ActivateDayBreakEvent, async ({ gameId, spaceOption }: ActivateDayBreakData) => {
    gameStateManager.verifyActivateDayBreakEvent(gameId);
    const game = gameStateManager.getActiveGame(gameId);

    if (game.players.length === 2 && AllSpaceOptionsSchema.safeParse(spaceOption).error) {
      throw new InvalidSpaceError(spaceOption);
    }

    game.activateDayBreak(socket.id, spaceOption);
    gameStateManager.processActivateDayBreakEvent(gameId);
  }));

  /*
    PHASE 1
      Daybreak Effects

    PHASE 2
      Draw Card from deck
      Swap Cards
      Summon Card
      Play Attack/Spell
      Level Up
      Sage Ability
    
    PHASE 3
      Buy Card ✅
        Item Shop ✅
        Creature Shop ✅
      Sell Card
      Summon Bought Card
      Refresh Shop

    PHASE 4
      Discard any number of cards
      Draw Cards until 5

    MISC
      Both players confirm action (4 players)
      Toggle hand view (4 players - Yours/Teammate)
      Instant Cards
      Triggered Effects
      Reshuffle Discard Pile
      Gain/Lose Gold
      Gain/Lose Shield
      Gain/Lose Boost
      Take Damage
  */
});


// Connect to MongoDB first
mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/command_of_nature")
  .then(() => {
    console.debug('Connected to MongoDB');
    // Start the server after successful database connection
    server.listen(PORT, async () => {
      console.debug(`WebSocket server running on http://localhost:${PORT}`);
      await gameStateManager.loadExistingGames();
    ""});
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export { server, io };
