import express from 'express';
import { ConGameModel } from '../models/ConGame/db-model';
import { GameListing } from '@shared-types';

const router = express.Router();

// GET /api/game-listings?isStarted=false
router.get('/', async (req, res) => {
    try {
        const { isStarted } = req.query;
        
        const query: any = {};
        
        if (isStarted !== undefined) {
            query.isStarted = isStarted === 'true';
        }
    
        const games = await ConGameModel.find(query);
        const cleanedGames: GameListing[] = games.map((game) => {
            return {
                id: game.id,
                gameName: game.gameName,
                isPrivate: game.isPrivate,
                numPlayersTotal: game.numPlayersTotal,
                numCurrentPlayers: game.players.length,
            }
        });
        res.json(cleanedGames);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

export default router; 