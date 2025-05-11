import { Model } from 'mongoose';
import { IConGame } from './db-model';
import { ConGame, ActiveConGame } from './ConGame';
import { NotFoundError } from '../../services/CustomError/BaseError';

/**
 * Service class for managing ConGame instances in the database
 * @class ConGameService
 */
export class ConGameService {
    private model: Model<IConGame>;

    /**
     * Creates a new ConGameService instance
     * @param {Model<IConGame>} model - The Mongoose model for ConGame
     */
    constructor(model: Model<IConGame>) {
        this.model = model;
    }

    async findAllGames(): Promise<ConGame[]> {
        const docs = await this.model.find({});
        return docs.map(doc => ConGame.fromMongoose(doc));
    }

    async createGame(numPlayers: ConGame['numPlayersTotal'], gameName: ConGame['gameName'], isPrivate: ConGame['isPrivate'], password: ConGame['password']): Promise<ConGame> {
        const game = new ConGame(numPlayers, gameName, isPrivate, password);
        const doc = await this.model.create(game.toMongoose());
        return ConGame.fromMongoose(doc);
    }

    async findGameById(id: string): Promise<ConGame> {
        const doc = await this.model.findById(id);
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ConGame.fromMongoose(doc);
    }

    async findActiveGameById(id: string): Promise<ActiveConGame> {
        const doc = await this.model.findById(id);
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ActiveConGame.fromMongoose(doc);
    }

    async updateGameState(id: string, updates: Partial<ConGame>): Promise<ConGame> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ConGame.fromMongoose(doc);
    }

    async updateActiveGameState(id: string, updates: Partial<ActiveConGame>): Promise<ActiveConGame> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ActiveConGame.fromMongoose(doc);
    }

    async addPlayerToGame(id: string, player: any): Promise<ConGame> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $push: { players: player } },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ConGame.fromMongoose(doc);
    }

    async removePlayerFromGame(id: string, playerId: string): Promise<ConGame> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $pull: { players: { socketId: playerId } } },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ConGame.fromMongoose(doc);
    }

    async updateShopCards(id: string, updates: {
        currentCreatureShopCards?: any[],
        currentItemShopCards?: any[]
    }): Promise<ConGame> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
        return ConGame.fromMongoose(doc);
    }

    async deleteGame(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('ConGame', `Game with id ${id} not found`);
        }
    }

    async findGamesByStatus(isActive: boolean): Promise<ConGame[]> {
        const docs = await this.model.find({ isActive });
        return docs.map(doc => ConGame.fromMongoose(doc));
    }
} 