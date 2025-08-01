import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET endpoint to retrieve user's active games
router.get('/:userId/games', async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const games = await prisma.conGame.findMany({
            where: {
                players: {
                    some: {
                        userId: userId
                    }
                }
            }
        });

        const activeGames = games.map(game => ({
            gameId: game.id,
            gameName: game.gameName,
            isPrivate: game.isPrivate,
            isStarted: game.isStarted,
            numPlayersTotal: game.numPlayersTotal,
            currentPlayers: game.players.length
        }));

        res.json({ activeGames });

    } catch (error) {
        console.error('Error fetching user games:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint to join or leave a game
router.post('/:userId/games', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { gameId, action } = req.body;

    if (!gameId || !action) {
        res.status(400).json({ error: 'Missing gameId or action' });
        return;
    }

    const validActions = ['create', 'join', 'leave'];
    if (!validActions.includes(action)) {
        res.status(400).json({ error: `Invalid action: ${action}` });
        return;
    }

    if (action === 'join') {

    }
    else if (action === 'leave') {

    }
    
});

export default router;