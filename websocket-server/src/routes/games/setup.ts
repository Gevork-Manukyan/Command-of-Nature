import express from 'express';
import { GameEventEmitter, GameStateManager, NotFoundError } from '../../services';
import { CreateGameData, GameListing, JoinGameData, RejoinGameData } from '@shared-types';
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
      // TODO: Implement select sage logic
      res.json({ message: 'Select sage endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/all-sages-selected
    router.post('/:gameId/all-sages-selected', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement all sages selected logic
      res.json({ message: 'All sages selected endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/join-team
    router.post('/:gameId/join-team', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement join team logic
      res.json({ message: 'Join team endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/clear-teams
    router.post('/:gameId/clear-teams', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement clear teams logic
      res.json({ message: 'Clear teams endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/all-teams-joined
    router.post('/:gameId/all-teams-joined', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement all teams joined logic
      res.json({ message: 'All teams joined endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/toggle-ready
    router.post('/:gameId/toggle-ready', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement toggle ready status logic
      res.json({ message: 'Toggle ready status endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/start
    router.post('/:gameId/start', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement start game logic
      res.json({ message: 'Start game endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/choose-warriors
    router.post('/:gameId/choose-warriors', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement choose warriors logic
      res.json({ message: 'Choose warriors endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/swap-warriors
    router.post('/:gameId/swap-warriors', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement swap warriors logic
      res.json({ message: 'Swap warriors endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/finish-setup
    router.post('/:gameId/finish-setup', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement finish setup logic
      res.json({ message: 'Finish setup endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/cancel-setup
    router.post('/:gameId/cancel-setup', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement cancel setup logic
      res.json({ message: 'Cancel setup endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/all-players-setup
    router.post('/:gameId/all-players-setup', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement all players setup logic
      res.json({ message: 'All players setup endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/exit
    router.post('/:gameId/exit', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement exit game logic
      res.json({ message: 'Exit game endpoint - not implemented yet' });
    }));
    
    // POST /api/games/setup/:gameId/leave
    router.post('/:gameId/leave', asyncHandler(async (req: Request, res: Response) => {
      // TODO: Implement leave game logic
      res.json({ message: 'Leave game endpoint - not implemented yet' });
    }));

    return router;
}

