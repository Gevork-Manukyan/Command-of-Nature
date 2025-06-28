import express from 'express';
import setupRouter from './setup';
import gameplayRouter from './gameplay';

const router = express.Router();

router.use('/setup', setupRouter);
router.use('/gameplay', gameplayRouter);

export default router; 