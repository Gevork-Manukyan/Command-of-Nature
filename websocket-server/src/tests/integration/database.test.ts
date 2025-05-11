import mongoose from 'mongoose';
import { ConGameService } from '../../models/ConGame/con-game.service';
import { GameStateService } from '../../models/GameState/game-state.service';
import { ConGameModel } from '../../models/ConGame/db-model';
import { GameStateModel } from '../../models/GameState/db-model';
import { ConGame } from '../../models/ConGame/ConGame';
import { GameState } from '../../models/GameState/GameState';
import { GameDatabaseService } from '../../services/GameDatabaseService';
import { TransitionEvent, State } from '../../types/gamestate-types';

describe('Database Integration Tests', () => {
    let conGameService: ConGameService;
    let gameStateService: GameStateService;
    let gameDatabaseService: GameDatabaseService;
    const testGameId = 'test-game-123';
    const testNumPlayers = 2;

    beforeAll(async () => {
        // Connect to test database
        const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/command-of-nature-test';
        await mongoose.connect(mongoUri);
        
        // Initialize services
        conGameService = new ConGameService(ConGameModel);
        gameStateService = new GameStateService(GameStateModel);
        gameDatabaseService = GameDatabaseService.getInstance(conGameService, gameStateService);
    });

    afterAll(async () => {
        // Clean up and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear collections before each test
        await ConGameModel.deleteMany({});
        await GameStateModel.deleteMany({});
    });

    describe('Game Creation and Retrieval', () => {
        it('should create and retrieve a game', async () => {
            // Create a game
            const game = await conGameService.createGame(2, 'test-game', false, '');
            expect(game).toBeInstanceOf(ConGame);
            expect(game.id).toBe(testGameId);

            // Retrieve the game
            const retrievedGame = await conGameService.findGameById(testGameId);
            expect(retrievedGame).toBeInstanceOf(ConGame);
            expect(retrievedGame.id).toBe(testGameId);
        });
    });

    describe('Game State Management', () => {
        it('should create and retrieve a game state', async () => {
            // Create a game state
            const gameState = await gameStateService.createGameState(testGameId);
            expect(gameState).toBeInstanceOf(GameState);
            expect(gameState.gameId).toBe(testGameId);

            // Retrieve the game state
            const retrievedState = await gameStateService.findGameStateByGameId(testGameId);
            expect(retrievedState).toBeInstanceOf(GameState);
            expect(retrievedState.gameId).toBe(testGameId);
        });
    });

    describe('Game Save Service', () => {
        it('should save and retrieve complete game state', async () => {
            // Create a game and its state
            const game = await conGameService.createGame(2, 'test-game', false, '');
            const gameState = await gameStateService.createGameState(testGameId);

            // Update game state
            game.isStarted = true;
            gameState.processEvent(TransitionEvent.PLAYER_JOINED);

            // Save both
            await gameDatabaseService.saveGame(game);
            await gameDatabaseService.saveGameState(testGameId, gameState);

            // Retrieve and verify
            const retrievedGame = await conGameService.findGameById(testGameId);
            const retrievedState = await gameStateService.findGameStateByGameId(testGameId);

            expect(retrievedGame.isStarted).toBe(true);
            expect(retrievedState.getCurrentTransition().currentState).toBe(State.JOINING_GAME);
        });
    });

    describe('Game Deletion', () => {
        it('should delete a game and its associated state', async () => {
            // Create a game and its state
            const game = await conGameService.createGame(2, 'test-game', false, '');
            const gameState = await gameStateService.createGameState(testGameId);

            // Delete the game
            await conGameService.deleteGame(testGameId);

            // Verify game is deleted
            await expect(conGameService.findGameById(testGameId)).rejects.toThrow();
            
            // Verify game state is deleted
            await expect(gameStateService.findGameStateByGameId(testGameId)).rejects.toThrow();
        });
    });
}); 