import express from 'express';
import { GameEventEmitter } from '../../services';
import createGameplayRouter from './gameplay';
import createSetupRouter from './setup';


export default function createGamesRouter(gameEventEmitter: GameEventEmitter) {
    const router = express.Router();

    router.use('/setup', createSetupRouter(gameEventEmitter));
    router.use('/gameplay', createGameplayRouter(gameEventEmitter));

    return router; 
}