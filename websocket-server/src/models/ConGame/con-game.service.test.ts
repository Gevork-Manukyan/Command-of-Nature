import { ConGameService } from './con-game.service';
import { ConGameModel } from './db-model';
import { ConGame } from './ConGame';
import { NotFoundError } from '../../services/CustomError/BaseError';

// Mock the Mongoose model
jest.mock('./db-model');

describe('ConGameService', () => {
    let conGameService: ConGameService;
    const testGameId = 'test-game-123';
    const testNumPlayers = 2;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        conGameService = new ConGameService(ConGameModel as any);
    });

    describe('createGame', () => {
        it('should create a new game', async () => {
            const mockGame = new ConGame(2, testGameId, false, '');
            const mockDoc = { ...mockGame.toMongoose(), _id: testGameId };
            
            (ConGameModel.create as jest.Mock).mockResolvedValue(mockDoc);

            const result = await conGameService.createGame(2, testGameId, false, '');

            expect(ConGameModel.create).toHaveBeenCalledWith(mockGame.toMongoose());
            expect(result).toBeInstanceOf(ConGame);
            expect(result.id).toBe(testGameId);
        });
    });

    describe('findGameById', () => {
        it('should find a game by id', async () => {
            const mockGame = new ConGame(2, testGameId, false, '');
            const mockDoc = { ...mockGame.toMongoose(), _id: testGameId };
            
            (ConGameModel.findById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await conGameService.findGameById(testGameId);

            expect(ConGameModel.findById).toHaveBeenCalledWith(testGameId);
            expect(result).toBeInstanceOf(ConGame);
            expect(result.id).toBe(testGameId);
        });

        it('should throw NotFoundError when game not found', async () => {
            (ConGameModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(conGameService.findGameById(testGameId))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('findAllGames', () => {
        it('should find all games', async () => {
            const mockGames = [
                new ConGame(2, 'game1', false, ''),
                new ConGame(4, 'game2', false, '')
            ];
            const mockDocs = mockGames.map(game => ({ ...game.toMongoose(), _id: game.id }));
            
            (ConGameModel.find as jest.Mock).mockResolvedValue(mockDocs);

            const result = await conGameService.findAllGames();

            expect(ConGameModel.find).toHaveBeenCalledWith({});
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(ConGame);
            expect(result[1]).toBeInstanceOf(ConGame);
        });
    });

    describe('updateGameState', () => {
        it('should update game state', async () => {
            const mockGame = new ConGame(2, testGameId, false, '');
            mockGame.setId(testGameId);
            const mockDoc = { ...mockGame.toMongoose(), _id: testGameId };
            
            (ConGameModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockDoc);

            const result = await conGameService.updateGameState(testGameId, mockGame);

            expect(ConGameModel.findByIdAndUpdate).toHaveBeenCalledWith(
                testGameId,
                { $set: mockGame.toMongoose() },
                { new: true }
            );
            expect(result).toBeInstanceOf(ConGame);
            expect(result.id).toBe(testGameId);
        });

        it('should throw NotFoundError when game not found', async () => {
            const mockGame = new ConGame(2, testGameId, false, '');
            (ConGameModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(conGameService.updateGameState(testGameId, mockGame))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('deleteGame', () => {
        it('should delete a game', async () => {
            (ConGameModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: testGameId });

            await conGameService.deleteGame(testGameId);

            expect(ConGameModel.findByIdAndDelete).toHaveBeenCalledWith(testGameId);
        });
    });
}); 