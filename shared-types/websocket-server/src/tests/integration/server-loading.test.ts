import mongoose from 'mongoose';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { ConGameService } from '../../models/ConGame/con-game.service';
import { GameStateService } from '../../models/GameState/game-state.service';
import { ConGameModel } from '../../models/ConGame/db-model';
import { GameStateModel } from '../../models/GameState/db-model';
import { ConGame } from '../../models/ConGame/ConGame';
import { GameState } from '../../models/GameState/GameState';
import { GameStateManager } from '../../services/GameStateManager';
import { TransitionEvent } from '../../types/gamestate-types';

describe('Server Game Loading', () => {
    let conGameService: ConGameService;
    let gameStateService: GameStateService;
    let gameStateManager: GameStateManager;
    const testGameId = 'test-game-123';
    const testNumPlayers = 2;

    beforeAll(async () => {
        // Connect to test database
        const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/command-of-nature-test';
        await mongoose.connect(mongoUri);
        
        // Initialize services
        conGameService = new ConGameService(ConGameModel);
        gameStateService = new GameStateService(GameStateModel);
        gameStateManager = GameStateManager.getInstance();
    });

    afterAll(async () => {
        // Clean up and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear collections and game state manager before each test
        await ConGameModel.deleteMany({});
        await GameStateModel.deleteMany({});
        gameStateManager.clearGames();
    });

    describe('Game Loading on Server Start', () => {
        it('should load all games from database into GameStateManager', async () => {
            // Create multiple games with different states
            const game1 = await conGameService.createGame(2, 'test-game-1', false, '');
            const game2 = await conGameService.createGame(4, 'test-game-2', false, '');
            const gameState1 = await gameStateService.createGameState('game1');
            const gameState2 = await gameStateService.createGameState('game2');

            // Update game states
            game1.isStarted = true;
            game2.isStarted = false;
            gameState1.processEvent(TransitionEvent.PLAYER_JOINED);
            gameState2.processEvent(TransitionEvent.PLAYER_JOINED);

            // Save games
            await conGameService.updateGameState('game1', game1);
            await conGameService.updateGameState('game2', game2);
            await gameStateService.updateGameState('game1', gameState1);
            await gameStateService.updateGameState('game2', gameState2);

            // Simulate server start by loading games
            const games = await conGameService.findAllGames();
            for (const game of games) {
                const gameState = await gameStateService.findGameStateByGameId(game.id);
                gameStateManager.addGameAndState(game.id, game, gameState);
            }

            // Verify games are loaded in GameStateManager
            const loadedGames = gameStateManager.getAllGames();
            expect(Object.keys(loadedGames)).toHaveLength(2);
            expect(gameStateManager.getGame('game1')).toBeDefined();
            expect(gameStateManager.getGame('game2')).toBeDefined();
            expect(gameStateManager.getGame('game1').isStarted).toBe(true);
            expect(gameStateManager.getGame('game2').isStarted).toBe(false);
        });

        it('should handle missing game states gracefully', async () => {
            // Create a game without a game state
            const game = await conGameService.createGame(2, 'test-game-1', false, '');

            // Simulate server start by loading games
            const games = await conGameService.findAllGames();
            for (const game of games) {
                try {
                    const gameState = await gameStateService.findGameStateByGameId(game.id);
                    gameStateManager.addGameAndState(game.id, game, gameState);
                } catch (error: any) {
                    // Expected error when game state is missing
                    expect(error.message).toContain('GameState for game');
                }
            }

            // Verify game is not loaded in GameStateManager
            const loadedGames = gameStateManager.getAllGames();
            expect(Object.keys(loadedGames)).toHaveLength(0);
        });

        it('should maintain game state transitions after loading', async () => {
            // Create a game and its state
            const game = await conGameService.createGame(2, 'test-game-1', false, '');
            const gameState = await gameStateService.createGameState(testGameId);

            // Update game state with multiple transitions
            gameState.processEvent(TransitionEvent.PLAYER_JOINED);
            gameState.processEvent(TransitionEvent.PLAYER_SELECTED_SAGE);

            // Save game state
            await gameStateService.updateGameState(testGameId, gameState);

            // Simulate server start by loading games
            const games = await conGameService.findAllGames();
            for (const game of games) {
                const gameState = await gameStateService.findGameStateByGameId(game.id);
                gameStateManager.addGameAndState(game.id, game, gameState);
            }

            // Verify game state transitions are maintained
            const loadedGameState = gameStateManager.getGameState(testGameId);
            expect(loadedGameState.getCurrentTransition().currentState).toBeDefined();
        });
    });
}); 