import { GameStateService } from './game-state.service';
import { GameStateModel } from './db-model';
import { GameState } from './GameState';
import { NotFoundError } from '../../services/CustomError/BaseError';
import { TransitionEvent } from '../../types/gamestate-types';
import { gameId } from '../../types/types';

// Mock the Mongoose model
jest.mock('./db-model');

describe('GameStateService', () => {
    let gameStateService: GameStateService;
    const testGameId = "507f1f77bcf86cd799439011" as gameId;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        gameStateService = new GameStateService(GameStateModel as any);
    });

    describe('createGameState', () => {
        it('should create a new game state', async () => {
            const mockGameState = new GameState(testGameId);
            const mockDoc = { ...mockGameState.toMongoose(), _id: testGameId };
            
            (GameStateModel.create as jest.Mock).mockResolvedValue(mockDoc);

            const result = await gameStateService.createGameState(testGameId);

            expect(GameStateModel.create).toHaveBeenCalledWith(mockGameState.toMongoose());
            expect(result).toBeInstanceOf(GameState);
            expect(result.gameId).toBe(testGameId);
        });
    });

    describe('findGameStateById', () => {
        it('should find a game state by id', async () => {
            const mockGameState = new GameState(testGameId);
            const mockDoc = { ...mockGameState.toMongoose(), _id: testGameId };
            
            (GameStateModel.findById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await gameStateService.findGameStateById(testGameId);

            expect(GameStateModel.findById).toHaveBeenCalledWith(testGameId);
            expect(result).toBeInstanceOf(GameState);
            expect(result.gameId).toBe(testGameId);
        });

        it('should throw NotFoundError when game state not found', async () => {
            (GameStateModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(gameStateService.findGameStateById(testGameId))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('findGameStateByGameId', () => {
        it('should find a game state by game id', async () => {
            const mockGameState = new GameState(testGameId);
            const mockDoc = { ...mockGameState.toMongoose(), _id: testGameId };
            
            (GameStateModel.findOne as jest.Mock).mockResolvedValue(mockDoc);

            const result = await gameStateService.findGameStateByGameId(testGameId);

            expect(GameStateModel.findOne).toHaveBeenCalledWith({ gameId: testGameId });
            expect(result).toBeInstanceOf(GameState);
            expect(result.gameId).toBe(testGameId);
        });

        it('should throw NotFoundError when game state not found', async () => {
            (GameStateModel.findOne as jest.Mock).mockResolvedValue(null);

            await expect(gameStateService.findGameStateByGameId(testGameId))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('updateGameState', () => {
        it('should update game state', async () => {
            const mockGameState = new GameState(testGameId);
            const mockDoc = { ...mockGameState.toMongoose(), _id: testGameId };
            const updates = mockGameState.toMongoose();
            
            (GameStateModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockDoc);

            const result = await gameStateService.updateGameState(testGameId, updates);

            expect(GameStateModel.findByIdAndUpdate).toHaveBeenCalledWith(
                testGameId,
                { $set: updates },
                { new: true }
            );
            expect(result).toBeInstanceOf(GameState);
            expect(result.gameId).toBe(testGameId);
        });

        it('should throw NotFoundError when game state not found', async () => {
            (GameStateModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(gameStateService.updateGameState(testGameId, {}))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('processGameStateEvent', () => {
        it('should process a game state event', async () => {
            const mockGameState = new GameState(testGameId);
            const mockDoc = { ...mockGameState.toMongoose(), _id: testGameId };
            const event = TransitionEvent.PLAYER_JOINED;
            
            (GameStateModel.findById as jest.Mock).mockResolvedValue(mockDoc);
            (GameStateModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockDoc);

            const result = await gameStateService.processGameStateEvent(testGameId, event);

            expect(GameStateModel.findById).toHaveBeenCalledWith(testGameId);
            expect(GameStateModel.findByIdAndUpdate).toHaveBeenCalled();
            expect(result).toBeInstanceOf(GameState);
        });
    });
}); 