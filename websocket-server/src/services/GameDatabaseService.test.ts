import { GameDatabaseService } from './GameDatabaseService';
import { ConGameService } from '../models/ConGame/con-game.service';
import { GameStateService } from '../models/GameState/game-state.service';
import { ConGame } from '../models/ConGame/ConGame';
import { GameState } from '../models/GameState/GameState';

// Mock the services
jest.mock('../models/ConGame/con-game.service');
jest.mock('../models/GameState/game-state.service');

describe('GameDatabaseService', () => {
    let gameDatabaseService: GameDatabaseService;
    let conGameService: jest.Mocked<ConGameService>;
    let gameStateService: jest.Mocked<GameStateService>;
    let mockGame: ConGame;
    let mockGameState: GameState;
    const testGameId = 'test-game-id';
    const numPlayers = 2;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Create mock instances
        conGameService = new ConGameService({} as any) as jest.Mocked<ConGameService>;
        gameStateService = new GameStateService({} as any) as jest.Mocked<GameStateService>;
        
        // Create the service with mocked dependencies
        gameDatabaseService = GameDatabaseService.getInstance(conGameService, gameStateService);

        mockGame = new ConGame(numPlayers, 'test-game', false, '');
        mockGame.setId(testGameId);
        mockGameState = new GameState(testGameId);
    });

    describe('saveNewGame', () => {
        it('should create and save a new game and its state', async () => {
            // Mock the create methods
            conGameService.createGame.mockResolvedValue(mockGame);
            gameStateService.createGameState.mockResolvedValue(mockGameState);

            const result = await gameDatabaseService.saveNewGame(numPlayers, 'test-game', false, '');

            // Verify both services were called
            expect(conGameService.createGame).toHaveBeenCalledWith(numPlayers, 'test-game', false, '');
            expect(gameStateService.createGameState).toHaveBeenCalledWith(testGameId);
            
            // Verify the result
            expect(result).toEqual({ game: mockGame, state: mockGameState });
        });

        it('should handle errors when creating a new game fails', async () => {
            const mockError = new Error('Create failed');
            conGameService.createGame.mockRejectedValue(mockError);

            // The error should be caught and logged
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await expect(gameDatabaseService.saveNewGame(numPlayers, 'test-game', false, '')).rejects.toThrow(mockError);
            consoleSpy.mockRestore();

            expect(consoleSpy).toHaveBeenCalledWith('Failed to save new game:', mockError);
        });
    });

    describe('saveGameState', () => {
        it('should save both game and game state', async () => {
            // Mock the update methods
            conGameService.updateGameState.mockResolvedValue(mockGame);
            gameStateService.updateGameState.mockResolvedValue(mockGameState);

            await gameDatabaseService.saveGame(mockGame);
            await gameDatabaseService.saveGameState(testGameId, mockGameState);

            // Verify both services were called
            expect(conGameService.updateGameState).toHaveBeenCalledWith(testGameId, mockGame);
            expect(gameStateService.updateGameState).toHaveBeenCalledWith(testGameId, mockGameState);
        });

        it('should handle errors when saving fails', async () => {
            const mockError = new Error('Save failed');

            // Mock one of the services to fail
            conGameService.updateGameState.mockRejectedValue(mockError);
            gameStateService.updateGameState.mockResolvedValue(mockGameState);

            // The error should be caught and logged
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await gameDatabaseService.saveGame(mockGame);
            await gameDatabaseService.saveGameState(testGameId, mockGameState);
            consoleSpy.mockRestore();

            expect(consoleSpy).toHaveBeenCalledWith('Failed to save game state:', mockError);
        });
    });

    describe('findAllGames', () => {
        it('should return all games from the database', async () => {
            const mockGames = [mockGame];
            conGameService.findAllGames.mockResolvedValue(mockGames);

            const result = await gameDatabaseService.findAllGames();

            expect(conGameService.findAllGames).toHaveBeenCalled();
            expect(result).toEqual(mockGames);
        });
    });

    describe('findGameStateByGameId', () => {
        it('should return the game state for a given game ID', async () => {
            gameStateService.findGameStateByGameId.mockResolvedValue(mockGameState);

            const result = await gameDatabaseService.findGameStateByGameId(testGameId);

            expect(gameStateService.findGameStateByGameId).toHaveBeenCalledWith(testGameId);
            expect(result).toEqual(mockGameState);
        });
    });
}); 