import express from 'express';
import { GameEventEmitter, GameStateManager, InvalidSpaceError, NotFoundError } from '../../services';
import { ActivateDayBreakData, AllSpaceOptionsSchema, GetDayBreakCardsData, GetDayBreakCardsEvent } from '@shared-types';
import { UserSocketManager } from 'src/services/UserSocketManager';

const gameStateManager = GameStateManager.getInstance();
const userSocketManager = UserSocketManager.getInstance();

// TODO: duplicate code from setup.ts
function getSocketId(userId: string) {
  const socketId = userSocketManager.getSocketId(userId);
  if (!socketId) {
      throw new NotFoundError("Socket ID not found");
  }
  return socketId;
}

export default function createGameplayRouter(gameEventEmitter: GameEventEmitter) {
  const router = express.Router();

  // POST /api/games/gameplay/:gameId/day-break-cards
  router.post('/:gameId/day-break-cards', async (req, res) => {
    const { userId }: GetDayBreakCardsData = req.body;
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
    const { userId, spaceOption }: ActivateDayBreakData = req.body;
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