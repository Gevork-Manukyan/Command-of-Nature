import { createServer } from "http"; 
import { Server } from "socket.io";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import gameListingsRouter from "./routes/game-listings";
import usersRouter from "./routes/users";
import { PORT, processEventMiddleware, socketErrorHandler } from "./lib";
import { GameEventEmitter, GameStateManager, ValidationError, InvalidSpaceError } from "./services";
import { AllSpaceOptionsSchema, CancelSetupData, ChoseWarriorsData, ClearTeamsData, CreateGameData, PlayerFinishedSetupData, JoinGameData, JoinTeamData, LeaveGameData, SelectSageData, SocketEventMap, StartGameData, SwapWarriorsData, ToggleReadyStatusData, AllPlayersSetupData, AllSagesSelectedData, ActivateDayBreakData, GetDayBreakCardsData, ExitGameData, RejoinGameData, AllTeamsJoinedData,ActivateDayBreakEvent, AllPlayersSetupEvent, AllSagesSelectedEvent, AllTeamsJoinedEvent, CancelSetupEvent, ChoseWarriorsEvent, ClearTeamsEvent, CreateGameEvent, DebugEvent, ExitGameEvent, GameListing, GetDayBreakCardsEvent, JoinGameEvent, JoinTeamEvent, LeaveGameEvent, PlayerFinishedSetupEvent, RejoinGameEvent, SelectSageEvent, StartGameEvent, SwapWarriorsEvent, ToggleReadyStatusEvent, RegisterUserSocketEvent, RegisterUserData } from "@shared-types";
import { UserSocketManager } from "./services/UserSocketManager";
import createGamesRouter from "./routes/games";
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

// Create server and io
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
const userSocketManager = UserSocketManager.getInstance();

// API routes
app.use('/api/games', createGamesRouter(gameEventEmitter));
app.use('/api/game-listings', gameListingsRouter);
app.use('/api/users', usersRouter);

// Error handling middleware (must be last)
app.use(errorHandler as express.ErrorRequestHandler);

gameNamespace.on("connection", (socket) => {
  /* -------- MIDDLEWARE -------- */
  socket.use(([event, rawData], next) => {
    processEventMiddleware(socket, event as keyof SocketEventMap, rawData, next)
  });

  socket.on("error", (error: Error) => {
    console.error("Socket error:", error);
  });

  /* -------- AUTO-REGISTER USER ID ON CONNECT -------- */
  // Extract userId from query parameters
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    userSocketManager.registerSocket(userId, socket);
    socket.emit(`${RegisterUserSocketEvent}--success`);
  } else {
    console.warn('Socket connected without userId in query parameters');
  }

  // Store socket ID and userId pair for REST API responses
  socket.on(RegisterUserSocketEvent, ({ userId }: RegisterUserData) => {
    userSocketManager.registerSocket(userId, socket);
    socket.emit(`${RegisterUserSocketEvent}--success`);
  });

  /* -------- GAME SETUP -------- */
  // TODO: some events should emit to all players that something happened

  // TODO: FOR DEBUGING
  socket.on(DebugEvent, socketErrorHandler(socket, DebugEvent, async () => {
    socket.emit("debug", gameStateManager);
  }));

  socket.on(SelectSageEvent, socketErrorHandler(socket, SelectSageEvent, async ({ gameId, sage }: SelectSageData) => {
    gameStateManager.verifySelectSageEvent(gameId);
    await gameStateManager.setPlayerSage(gameId, socket.id, sage);
    gameStateManager.processSelectSageEvent(gameId);

    const availableSages = gameStateManager.getGame(gameId).getAvailableSages();
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, `sage-selected`, { selectedSage: sage, availableSages });
    socket.emit(`${SelectSageEvent}--success`);
  }));

  // TODO: implement on client side
  socket.on(AllSagesSelectedEvent, socketErrorHandler(socket, AllSagesSelectedEvent, async ({ gameId }: AllSagesSelectedData) => {
    gameStateManager.verifyAllSagesSelectedEvent(gameId);
    await gameStateManager.allPlayersSelectedSage(gameId);
    gameStateManager.processAllSagesSelectedEvent(gameId);

    gameEventEmitter.emitToAllPlayers(gameId, `${AllSagesSelectedEvent}--success`);
  }));

  // TODO: implement on client side
  socket.on(JoinTeamEvent, socketErrorHandler(socket, JoinTeamEvent, async ({ gameId, team }: JoinTeamData) => {
    gameStateManager.verifyJoinTeamEvent(gameId);
    await gameStateManager.joinTeam(gameId, socket.id, team);
    gameStateManager.processJoinTeamEvent(gameId);
    
    const player = gameStateManager.getGame(gameId).getPlayer(socket.id);
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, "team-joined", { id: player.userId, team });
    socket.emit(`${JoinTeamEvent}--success`);
  }));

  // TODO: implement on client side
  socket.on(ClearTeamsEvent, socketErrorHandler(socket, ClearTeamsEvent, async ({ gameId }: ClearTeamsData) => {
    gameStateManager.verifyClearTeamsEvent(gameId);
    gameStateManager.getGame(gameId).clearTeams();
    gameStateManager.processClearTeamsEvent(gameId);

    gameEventEmitter.emitToAllPlayers(gameId, `${ClearTeamsEvent}--success`);
  }));

  // TODO: implement on client side
  socket.on(AllTeamsJoinedEvent, socketErrorHandler(socket, AllTeamsJoinedEvent, async ({ gameId }: AllTeamsJoinedData) => {
    gameStateManager.verifyAllTeamsJoinedEvent(gameId);
    await gameStateManager.allTeamsJoined(gameId);
    gameStateManager.processAllTeamsJoinedEvent(gameId);

    gameEventEmitter.emitToAllPlayers(gameId, `${AllTeamsJoinedEvent}--success`);
  }));

  // TODO: implement on client side
  socket.on(ToggleReadyStatusEvent, socketErrorHandler(socket, ToggleReadyStatusEvent, async ({ gameId }: ToggleReadyStatusData) => {
    gameStateManager.verifyToggleReadyStatusEvent(gameId);
    const isReady = gameStateManager.toggleReadyStatus(gameId, socket.id);
    gameStateManager.processToggleReadyStatusEvent(gameId);

    const player = gameStateManager.getGame(gameId).getPlayer(socket.id);
    const eventName = isReady ? "ready-status--ready" : "ready-status--not-ready";
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socket.id, eventName, { id: player.userId, isReady });
    socket.emit(eventName);
  }));

  // TODO: implement on client side
  socket.on(StartGameEvent, socketErrorHandler(socket, StartGameEvent, async ({ gameId }: StartGameData) => {
    gameStateManager.verifyAllPlayersReadyEvent(gameId);
    await gameStateManager.startGame(gameId);
    gameStateManager.processAllPlayersReadyEvent(gameId);
    
    gameEventEmitter.emitPickWarriors(gameId);
    socket.emit(`${StartGameEvent}--success`);
  }));

  // TODO: implement on client side
  socket.on(ChoseWarriorsEvent, socketErrorHandler(socket, ChoseWarriorsEvent, async ({ gameId, choices }: ChoseWarriorsData) => {
    gameStateManager.verifyChooseWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.userId).chooseWarriors(player, choices);
    gameStateManager.processChooseWarriorsEvent(gameId);
    socket.emit(`${ChoseWarriorsEvent}--success`)
  }));

  // TODO: implement on client side
  socket.on(SwapWarriorsEvent, socketErrorHandler(socket, SwapWarriorsEvent, async ({ gameId }: SwapWarriorsData) => {
    gameStateManager.verifySwapWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.userId).swapWarriors(player);
    gameStateManager.processSwapWarriorsEvent(gameId);
    socket.emit(`${SwapWarriorsEvent}--success`)
  }));

  // TODO: implement on client side
  socket.on(PlayerFinishedSetupEvent, socketErrorHandler(socket, PlayerFinishedSetupEvent, async ({ gameId }: PlayerFinishedSetupData) => {
    gameStateManager.verifyFinishedSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    game.getPlayer(socket.id).finishPlayerSetup();
    game.incrementPlayersFinishedSetup();
    gameStateManager.processFinishedSetupEvent(gameId);
    socket.emit(`${PlayerFinishedSetupEvent}--success`)
  }));

  // TODO: implement on client side
  socket.on(CancelSetupEvent, socketErrorHandler(socket, CancelSetupEvent, async ({ gameId }: CancelSetupData) => {
    gameStateManager.verifyCancelSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId)
    game.getPlayer(socket.id).cancelPlayerSetup();
    game.decrementPlayersFinishedSetup();
    gameStateManager.processCancelSetupEvent(gameId);
    socket.emit(`${CancelSetupEvent}--success`)
  }))

  // TODO: implement on client side
  socket.on(AllPlayersSetupEvent, socketErrorHandler(socket, AllPlayersSetupEvent, async ({ gameId }: AllPlayersSetupData) => {
    gameStateManager.verifyAllPlayersSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    if (game.numPlayersFinishedSetup !== game.players.length) throw new ValidationError("All players have not finished setup", "players");
    const activeGame = gameStateManager.beginBattle(game);
    gameStateManager.processAllPlayersSetupEvent(gameId);
    gameEventEmitter.emitStartTurn(activeGame.getActiveTeamPlayers(), activeGame.getWaitingTeamPlayers());
    socket.emit(`${AllPlayersSetupEvent}--success`);
  }));

  socket.on(ExitGameEvent, socketErrorHandler(socket, ExitGameEvent, async ({ gameId }: ExitGameData) => {
    socket.leave(gameId);
    socket.emit(`${ExitGameEvent}--success`);
  }));

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
