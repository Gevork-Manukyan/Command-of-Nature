import express from 'express';
import { GameEventEmitter, GameStateManager, NotFoundError } from '../../services';
import { AllSagesSelectedData, AllSagesSelectedEvent, AllTeamsJoinedData, AllTeamsJoinedEvent, ChoseWarriorsData, ChoseWarriorsEvent, ClearTeamsData, ClearTeamsEvent, CreateGameData, GameListing, JoinGameData, JoinTeamData, PlayerFinishedSetupData, PlayerFinishedSetupEvent, RejoinGameData, SelectSageData, StartGameData, SwapWarriorsData, SwapWarriorsEvent, ToggleReadyStatusData, ToggleReadyStatusEvent } from '@shared-types';
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
      const { userId, gameId, sage }: SelectSageData = req.body;
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
      const { gameId }: AllSagesSelectedData = req.body;

      gameStateManager.verifyAllSagesSelectedEvent(gameId);
      await gameStateManager.allPlayersSelectedSage(gameId);
      gameStateManager.processAllSagesSelectedEvent(gameId);

      gameEventEmitter.emitToAllPlayers(gameId, `${AllSagesSelectedEvent}--success`);
      res.status(200).json({ message: 'All sages selected successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/join-team
    router.post('/:gameId/join-team', asyncHandler(async (req: Request, res: Response) => {
      const { userId, gameId, team }: JoinTeamData = req.body;
      const socketId = getSocketId(userId);

      gameStateManager.verifyJoinTeamEvent(gameId);
      await gameStateManager.joinTeam(gameId, socketId, team);
      gameStateManager.processJoinTeamEvent(gameId);

      const player = gameStateManager.getGame(gameId).getPlayer(socketId);
      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, "team-joined", { id: player.userId, team });
      res.status(200).json({ message: 'Team joined successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/clear-teams
    router.post('/:gameId/clear-teams', asyncHandler(async (req: Request, res: Response) => {
      const { gameId }: ClearTeamsData = req.body;

      gameStateManager.verifyClearTeamsEvent(gameId);
      gameStateManager.getGame(gameId).clearTeams();
      gameStateManager.processClearTeamsEvent(gameId);

      gameEventEmitter.emitToAllPlayers(gameId, `${ClearTeamsEvent}--success`);
      res.status(200).json({ message: 'Teams cleared successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-teams-joined
    router.post('/:gameId/all-teams-joined', asyncHandler(async (req: Request, res: Response) => {
      const { gameId }: AllTeamsJoinedData = req.body;

      gameStateManager.verifyAllTeamsJoinedEvent(gameId);
      await gameStateManager.allTeamsJoined(gameId);
      gameStateManager.processAllTeamsJoinedEvent(gameId);

      gameEventEmitter.emitToAllPlayers(gameId, `${AllTeamsJoinedEvent}--success`);
      res.status(200).json({ message: 'All teams joined successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/toggle-ready
    router.post('/:gameId/toggle-ready', asyncHandler(async (req: Request, res: Response) => {
      const { userId, gameId }: ToggleReadyStatusData = req.body;
      const socketId = getSocketId(userId);

      gameStateManager.verifyToggleReadyStatusEvent(gameId);
      const isReady = gameStateManager.toggleReadyStatus(gameId, socketId);
      gameStateManager.processToggleReadyStatusEvent(gameId);

      const player = gameStateManager.getGame(gameId).getPlayer(socketId);
      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `${ToggleReadyStatusEvent}--success`, { id: player.userId, isReady });
      res.status(200).json({ message: 'Ready status toggled successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/start
    router.post('/:gameId/start', asyncHandler(async (req: Request, res: Response) => {
      const { gameId }: StartGameData = req.body;

      gameStateManager.verifyAllPlayersReadyEvent(gameId);
      await gameStateManager.startGame(gameId);
      gameStateManager.processAllPlayersReadyEvent(gameId);

      gameEventEmitter.emitPickWarriors(gameId);
      res.status(200).json({ message: 'Game started successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/choose-warriors
    router.post('/:gameId/choose-warriors', asyncHandler(async (req: Request, res: Response) => {
      const { userId, gameId, choices }: ChoseWarriorsData = req.body;
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
      const { userId, gameId }: SwapWarriorsData = req.body;
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
      const { userId, gameId }: PlayerFinishedSetupData = req.body;
      const socketId = getSocketId(userId);

      gameStateManager.verifyFinishedSetupEvent(gameId);
      const game = gameStateManager.getGame(gameId);
      const player = game.getPlayer(socketId);
      player.finishPlayerSetup();
      game.incrementPlayersFinishedSetup();
      gameStateManager.processFinishedSetupEvent(gameId);

      gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, `${PlayerFinishedSetupEvent}--success`, { id: player.userId });
      res.status(200).json({ message: 'Setup finished successfully' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/cancel-setup
    router.post('/:gameId/cancel-setup', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement cancel setup logic
      res.json({ message: 'Cancel setup endpoint - not implemented yet' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-players-setup
    router.post('/:gameId/all-players-setup', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement all players setup logic
      res.json({ message: 'All players setup endpoint - not implemented yet' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/exit
    router.post('/:gameId/exit', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement exit game logic
      res.json({ message: 'Exit game endpoint - not implemented yet' });
    }));
    
    // TODO: implement on client side
    // POST /api/games/setup/:gameId/leave
    router.post('/:gameId/leave', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement leave game logic
      res.json({ message: 'Leave game endpoint - not implemented yet' });
    }));

    return router;
}

