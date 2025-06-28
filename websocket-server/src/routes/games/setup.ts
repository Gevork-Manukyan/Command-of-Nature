import express from 'express';
import { GameStateManager } from '../../services';
import { CreateGameData, GameListing } from '@shared-types';
import { UserSocketManager } from '../../services/UserSocketManager';

const router = express.Router();
const gameStateManager = GameStateManager.getInstance();
const userSocketManager = UserSocketManager.getInstance();

// POST /api/games/setup/create
router.post('/create', async (req, res) => {
    const { userId, numPlayers, gameName, isPrivate, password }: CreateGameData = req.body;
    const socketId = userSocketManager.getSocketId(userId);
    if (!socketId) {
        res.status(404).json({ error: 'Socket ID not found' });
        return;
    }
    
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
});

// POST /api/games/setup/join
router.post('/join', async (req, res) => {
  // TODO: Implement join game logic
  res.json({ message: 'Join game endpoint - not implemented yet' });
});

// POST /api/games/setup/rejoin
router.post('/rejoin', async (req, res) => {
  // TODO: Implement rejoin game logic
  res.json({ message: 'Rejoin game endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/sage
router.post('/:gameId/sage', async (req, res) => {
  // TODO: Implement select sage logic
  res.json({ message: 'Select sage endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/all-sages-selected
router.post('/:gameId/all-sages-selected', async (req, res) => {
  // TODO: Implement all sages selected logic
  res.json({ message: 'All sages selected endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/join-team
router.post('/:gameId/join-team', async (req, res) => {
  // TODO: Implement join team logic
  res.json({ message: 'Join team endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/clear-teams
router.post('/:gameId/clear-teams', async (req, res) => {
  // TODO: Implement clear teams logic
  res.json({ message: 'Clear teams endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/all-teams-joined
router.post('/:gameId/all-teams-joined', async (req, res) => {
  // TODO: Implement all teams joined logic
  res.json({ message: 'All teams joined endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/toggle-ready
router.post('/:gameId/toggle-ready', async (req, res) => {
  // TODO: Implement toggle ready status logic
  res.json({ message: 'Toggle ready status endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/start
router.post('/:gameId/start', async (req, res) => {
  // TODO: Implement start game logic
  res.json({ message: 'Start game endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/choose-warriors
router.post('/:gameId/choose-warriors', async (req, res) => {
  // TODO: Implement choose warriors logic
  res.json({ message: 'Choose warriors endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/swap-warriors
router.post('/:gameId/swap-warriors', async (req, res) => {
  // TODO: Implement swap warriors logic
  res.json({ message: 'Swap warriors endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/finish-setup
router.post('/:gameId/finish-setup', async (req, res) => {
  // TODO: Implement finish setup logic
  res.json({ message: 'Finish setup endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/cancel-setup
router.post('/:gameId/cancel-setup', async (req, res) => {
  // TODO: Implement cancel setup logic
  res.json({ message: 'Cancel setup endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/all-players-setup
router.post('/:gameId/all-players-setup', async (req, res) => {
  // TODO: Implement all players setup logic
  res.json({ message: 'All players setup endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/exit
router.post('/:gameId/exit', async (req, res) => {
  // TODO: Implement exit game logic
  res.json({ message: 'Exit game endpoint - not implemented yet' });
});

// POST /api/games/setup/:gameId/leave
router.post('/:gameId/leave', async (req, res) => {
  // TODO: Implement leave game logic
  res.json({ message: 'Leave game endpoint - not implemented yet' });
});

export default router; 