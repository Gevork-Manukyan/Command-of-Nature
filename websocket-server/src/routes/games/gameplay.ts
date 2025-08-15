import express from 'express';
import { GameEventEmitter, GameStateManager, InvalidSpaceError, NotFoundError } from '../../services';
import { ActivateDayBreakData, activateDayBreakSchema, AllSpaceOptionsSchema, ExitGameData, ExitGameEvent, exitGameSchema, GetDayBreakCardsData, GetDayBreakCardsEvent, getDayBreakCardsSchema, LeaveGameData, leaveGameSchema, PlayerLeftData, PlayerLeftEvent } from '@shared-types';
import { UserSocketManager } from 'src/services/UserSocketManager';
import { asyncHandler } from 'src/middleware/asyncHandler';
import { getSocketId } from '../../lib/utilities/common';
import { Request, Response } from 'express';
import { requireHostForGameExit } from 'src/middleware/hostOnly';
import { validateRequestBody } from 'src/lib/utilities/routes';

const gameStateManager = GameStateManager.getInstance();
const userSocketManager = UserSocketManager.getInstance();

export default function createGameplayRouter(gameEventEmitter: GameEventEmitter) {
  const router = express.Router();

  // TODO: implement on client side
  // Exits the game for everyone. Only the host can exit the game.
  // POST /api/games/gameplay/:gameId/exit
  router.post('/:gameId/exit', requireHostForGameExit, asyncHandler(async (req: Request, res: Response) => {
    const { userId } = validateRequestBody<ExitGameData>(exitGameSchema, req);
    const gameId = req.params.gameId;
    const socketId = getSocketId(userId);

    userSocketManager.leaveGameRoom(userId, gameId);
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, ExitGameEvent);
    res.status(200).json({ message: 'Game exited successfully' });
  }));
  
  // TODO: implement on client side
  // POST /api/games/gameplay/:gameId/leave
  router.post('/:gameId/leave', asyncHandler(async (req: Request, res: Response) => {
    const { userId } = validateRequestBody<LeaveGameData>(leaveGameSchema, req);
    const gameId = req.params.gameId;
    const socketId = getSocketId(userId);

    await gameStateManager.removePlayerFromGame(gameId, socketId);
    userSocketManager.leaveGameRoom(userId, gameId);
    gameEventEmitter.emitToOtherPlayersInRoom(gameId, socketId, PlayerLeftEvent, { userId } as PlayerLeftData);
    res.status(200).json({ message: 'Game left successfully' });
  }));

  // POST /api/games/gameplay/:gameId/day-break-cards
  router.post('/:gameId/day-break-cards', async (req, res) => {
    const { userId } = validateRequestBody<GetDayBreakCardsData>(getDayBreakCardsSchema, req);
    const gameId = req.params.gameId;
    const socketId = getSocketId(userId);

    gameStateManager.verifyGetDayBreakCardsEvent(gameId);
    const game = gameStateManager.getActiveGame(gameId);
    const dayBreakCards = game.getDayBreakCards(socketId);
    gameStateManager.processGetDayBreakCardsEvent(gameId);
    gameEventEmitter.emitToPlayers(game.getActiveTeamPlayers(), GetDayBreakCardsEvent, dayBreakCards);
    res.status(200).json({ message: 'Day break cards fetched successfully' });
  });

  // POST /api/games/gameplay/:gameId/activate-day-break
  router.post('/:gameId/activate-day-break', async (req, res) => {
    const { userId, spaceOption } = validateRequestBody<ActivateDayBreakData>(activateDayBreakSchema, req);
    const gameId = req.params.gameId;
    const socketId = getSocketId(userId);
    
    gameStateManager.verifyActivateDayBreakEvent(gameId);
    const game = gameStateManager.getActiveGame(gameId);

    if (game.players.length === 2 && AllSpaceOptionsSchema.safeParse(spaceOption).error) {
      throw new InvalidSpaceError(spaceOption);
    }

    game.activateDayBreak(socketId, spaceOption);
    gameStateManager.processActivateDayBreakEvent(gameId);
    res.status(200).json({ message: 'Day break activated successfully' });
  });

  return router; 
}