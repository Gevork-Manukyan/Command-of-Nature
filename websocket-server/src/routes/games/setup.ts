import express from 'express';
import { GameEventEmitter, GameStateManager, NotFoundError, ValidationError } from '../../services';
import { AllSagesSelectedEvent, AllTeamsJoinedEvent, CancelSetupData, CancelSetupEvent, ChoseWarriorsData, ClearTeamsEvent, CreateGameData, ExitGameData, ExitGameEvent, GameListing, JoinGameData, JoinTeamData, LeaveGameData, LeaveGameEvent, PlayerFinishedSetupData, PlayerFinishedSetupEvent, RejoinGameData, SelectSageData, SwapWarriorsData, ToggleReadyStatusData, ToggleReadyStatusEvent } from '@shared-types';
import { UserSocketManager } from '../../services/UserSocketManager';
import { asyncHandler } from 'src/middleware/asyncHandler';
import { Request, Response } from 'express';

const gameStateManager = GameStateManager.getInstance();
const userSocketManager = UserSocketManager.getInstance();

function getSocketId(userId: string) {
    const socketId = userSocketManager.getSocketId(userId);
    if (!socketId) {
        throw new NotFoundError("Socket ID not found");
    }
    return socketId;
}

export default function createSetupRouter(gameEventEmitter: GameEventEmitter) {
    const router = express.Router();
    
    // POST /api/games/setup/create
    router.post('/create', asyncHandler(async (req: Request, res: Response) => {
        const { userId, numPlayers, gameName, isPrivate, password }: CreateGameData = req.body;
        const socketId = getSocketId(userId);
        
        const { game } = await gameStateManager.createGame(numPlayers, gameName, isPrivate, password || '');
        gameStateManager.playerJoinGame(userId, socketId, game.id, true, password);
        const gameListing: GameListing = {
          id: game.id,
          gameName: game.gameName,
          isPrivate: game.isPrivate,
          numPlayersTotal: game.numPlayersTotal,
          numCurrentPlayers: game.players.length,
        }
        
        userSocketManager.joinGameRoom(userId, game.id);
        res.json(gameListing);
    }));
    
    // POST /api/games/setup/join
    router.post('/join', asyncHandler(async (req: Request, res: Response) => {
      const { userId, gameId, password }: JoinGameData = req.body;
      const socketId = getSocketId(userId);
    
      gameStateManager.verifyJoinGameEvent(gameId);
      await gameStateManager.playerJoinGame(userId, socketId, gameId, false, password);
      gameStateManager.processJoinGameEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      const gameListing: GameListing = {
        id: gameId,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length,
      }
    
      userSocketManager.joinGameRoom(userId, gameId);
      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, "player-joined", { userId });
      res.json(gameListing);
    }));
    
    // POST /api/games/setup/rejoin
    router.post('/rejoin', asyncHandler(async (req: Request, res: Response) => {
      const { userId, gameId }: RejoinGameData = req.body;
      const socketId = getSocketId(userId);

      await gameStateManager.playerRejoinedGame(gameId, userId, socketId);
      const game = gameStateManager.getGame(gameId);
      const gameListing: GameListing = {
        id: gameId,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length,
      }

      userSocketManager.joinGameRoom(userId, gameId);
      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, "player-rejoined", { userId });
      res.json(gameListing);
    }));
    
    // POST /api/games/setup/:gameId/sage
    router.post('/:gameId/sage', asyncHandler(async (req: Request, res: Response) => {
      const { userId, sage }: SelectSageData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifySelectSageEvent(gameId);
      await gameStateManager.setPlayerSage(gameId, socketId, sage);
      gameStateManager.processSelectSageEvent(gameId);

      const availableSages = gameStateManager.getGame(gameId).getAvailableSages();
      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `sage-selected`, { selectedSage: sage, availableSages });
      res.status(200).json({ message: 'Sage selected successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-sages-selected
    router.post('/:gameId/all-sages-selected', asyncHandler(async (req: Request, res: Response) => {
      const gameId = req.params.gameId;

      gameStateManager.verifyAllSagesSelectedEvent(gameId);
      await gameStateManager.allPlayersSelectedSage(gameId);
      gameStateManager.processAllSagesSelectedEvent(gameId);

      gameEventEmitter.emitToAllPlayers(gameId, `${AllSagesSelectedEvent}--success`);
      res.status(200).json({ message: 'All sages selected successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/join-team
    router.post('/:gameId/join-team', asyncHandler(async (req: Request, res: Response) => {
      const { userId, team }: JoinTeamData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifyJoinTeamEvent(gameId);
      await gameStateManager.joinTeam(gameId, socketId, team);
      gameStateManager.processJoinTeamEvent(gameId);

      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, "team-joined", { id: userId, team });
      res.status(200).json({ message: 'Team joined successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/clear-teams
    router.post('/:gameId/clear-teams', asyncHandler(async (req: Request, res: Response) => {
      const gameId = req.params.gameId;

      gameStateManager.verifyClearTeamsEvent(gameId);
      gameStateManager.getGame(gameId).clearTeams();
      gameStateManager.processClearTeamsEvent(gameId);

      gameEventEmitter.emitToAllPlayers(gameId, `${ClearTeamsEvent}--success`);
      res.status(200).json({ message: 'Teams cleared successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-teams-joined
    router.post('/:gameId/all-teams-joined', asyncHandler(async (req: Request, res: Response) => {
      const gameId = req.params.gameId;

      gameStateManager.verifyAllTeamsJoinedEvent(gameId);
      await gameStateManager.allTeamsJoined(gameId);
      gameStateManager.processAllTeamsJoinedEvent(gameId);

      gameEventEmitter.emitToAllPlayers(gameId, `${AllTeamsJoinedEvent}--success`);
      res.status(200).json({ message: 'All teams joined successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/toggle-ready
    router.post('/:gameId/toggle-ready', asyncHandler(async (req: Request, res: Response) => {
      const { userId }: ToggleReadyStatusData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifyToggleReadyStatusEvent(gameId);
      const isReady = gameStateManager.toggleReadyStatus(gameId, socketId);
      gameStateManager.processToggleReadyStatusEvent(gameId);

      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `${ToggleReadyStatusEvent}--success`, { id: userId, isReady });
      res.status(200).json({ message: 'Ready status toggled successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/start
    router.post('/:gameId/start', asyncHandler(async (req: Request, res: Response) => {
      const gameId = req.params.gameId;

      gameStateManager.verifyAllPlayersReadyEvent(gameId);
      await gameStateManager.startGame(gameId);
      gameStateManager.processAllPlayersReadyEvent(gameId);

      gameEventEmitter.emitPickWarriors(gameId);
      res.status(200).json({ message: 'Game started successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/choose-warriors
    router.post('/:gameId/choose-warriors', asyncHandler(async (req: Request, res: Response) => {
      const { userId, choices }: ChoseWarriorsData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifyChooseWarriorsEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      const player = game.getPlayer(socketId);
      game.getPlayerTeam(player.userId).chooseWarriors(player, choices);
      gameStateManager.processChooseWarriorsEvent(gameId);

      res.status(200).json({ message: 'Warriors chosen successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/swap-warriors
    router.post('/:gameId/swap-warriors', asyncHandler(async (req: Request, res: Response) => {
      const { userId }: SwapWarriorsData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifySwapWarriorsEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      const player = game.getPlayer(socketId);
      game.getPlayerTeam(player.userId).swapWarriors(player);
      gameStateManager.processSwapWarriorsEvent(gameId);

      res.status(200).json({ message: 'Warriors swapped successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/finish-setup
    router.post('/:gameId/finish-setup', asyncHandler(async (req: Request, res: Response) => {
      const { userId }: PlayerFinishedSetupData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifyFinishedSetupEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      game.getPlayer(socketId).finishPlayerSetup();
      game.incrementPlayersFinishedSetup();
      gameStateManager.processFinishedSetupEvent(gameId);

      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `${PlayerFinishedSetupEvent}--success`, { id: userId });
      res.status(200).json({ message: 'Setup finished successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/cancel-setup
    router.post('/:gameId/cancel-setup', asyncHandler(async (req: Request, res: Response) => {
      const { userId }: CancelSetupData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      gameStateManager.verifyCancelSetupEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      game.getPlayer(socketId).cancelPlayerSetup();
      game.decrementPlayersFinishedSetup();
      gameStateManager.processCancelSetupEvent(gameId);

      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `${CancelSetupEvent}--success`, { id: userId });
      res.status(200).json({ message: 'Setup cancelled successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-players-setup
    router.post('/:gameId/all-players-setup', asyncHandler(async (req: Request, res: Response) => {
      const gameId = req.params.gameId;

      gameStateManager.verifyAllPlayersSetupEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      if (game.numPlayersFinishedSetup !== game.players.length) throw new ValidationError("All players have not finished setup", "players");
      const activeGame = gameStateManager.beginBattle(game);
      gameStateManager.processAllPlayersSetupEvent(gameId);
      gameEventEmitter.emitStartTurn(activeGame.getActiveTeamPlayers(), activeGame.getWaitingTeamPlayers());
      res.status(200).json({ message: 'All players setup successfully' });
    }));
    
    // TODO: implement on client side
    // TODO: How to handle if someone leaves the game midway through?
    // POST /api/games/setup/:gameId/exit
    router.post('/:gameId/exit', asyncHandler(async (req: Request, res: Response) => {
      const { userId }: ExitGameData = req.body;
      const gameId = req.params.gameId;

      userSocketManager.leaveGameRoom(userId, gameId);
      gameEventEmitter.emitToAllPlayers(gameId, `${ExitGameEvent}--success`, { id: userId });
      res.status(200).json({ message: 'Game exited successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/leave
    router.post('/:gameId/leave', asyncHandler(async (req: Request, res: Response) => {
      const { userId }: LeaveGameData = req.body;
      const gameId = req.params.gameId;
      const socketId = getSocketId(userId);

      await gameStateManager.removePlayerFromGame(gameId, socketId);
      userSocketManager.leaveGameRoom(userId, gameId);
      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `${LeaveGameEvent}--success`, { id: userId });
      res.status(200).json({ message: 'Game left successfully' });
    }));

    return router;
}

