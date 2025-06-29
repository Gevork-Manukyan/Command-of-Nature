import express from 'express';
import { GameEventEmitter } from '../../services';

export default function createGameplayRouter(gameEventEmitter: GameEventEmitter) {
  const router = express.Router();

  // POST /api/games/gameplay/:gameId/day-break-cards
  router.post('/:gameId/day-break-cards', async (req, res) => {
    // TODO: Implement get day break cards logic
    res.json({ message: 'Get day break cards endpoint - not implemented yet' });
  });

  // POST /api/games/gameplay/:gameId/activate-day-break
  router.post('/:gameId/activate-day-break', async (req, res) => {
    // TODO: Implement activate day break logic
    res.json({ message: 'Activate day break endpoint - not implemented yet' });
  });

  return router; 
}