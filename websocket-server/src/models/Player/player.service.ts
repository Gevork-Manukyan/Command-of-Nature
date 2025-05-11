import { Model } from 'mongoose';
import { IPlayer } from './db-model';
import { Player } from './Player';
import { NotFoundError } from '../../services/CustomError/BaseError';

/**
 * Service class for managing Player instances in the database
 * @class PlayerService
 */
export class PlayerService {
    private model: Model<IPlayer>;

    /**
     * Creates a new PlayerService instance
     * @param {Model<IPlayer>} model - The Mongoose model for Player
     */
    constructor(model: Model<IPlayer>) {
        this.model = model;
    }

    async createPlayer(userId: string, socketId: string, isGameHost: boolean = false): Promise<Player> {
        const player = new Player(userId, socketId, isGameHost);
        const doc = await this.model.create(player.toMongoose());
        return Player.fromMongoose(doc);
    }

    async findPlayerById(userId: string): Promise<Player> {
        const doc = await this.model.findOne({ userId });
        if (!doc) {
            throw new NotFoundError('Player', `Player with userId ${userId} not found`);
        }
        return Player.fromMongoose(doc);
    }

    async findPlayerBySocketId(socketId: string): Promise<Player> {
        const doc = await this.model.findOne({ socketId });
        if (!doc) {
            throw new NotFoundError('Player', `Player with socketId ${socketId} not found`);
        }
        return Player.fromMongoose(doc);
    }

    async updatePlayerSocketId(userId: string, newSocketId: string): Promise<Player> {
        const doc = await this.model.findOneAndUpdate(
            { userId },
            { socketId: newSocketId },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Player', `Player with userId ${userId} not found`);
        }
        return Player.fromMongoose(doc);
    }

    async updatePlayerState(userId: string, updates: Partial<Player>): Promise<Player> {
        const doc = await this.model.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Player', `Player with userId ${userId} not found`);
        }
        return Player.fromMongoose(doc);
    }

    async deletePlayer(userId: string): Promise<void> {
        const result = await this.model.deleteOne({ userId });
        if (result.deletedCount === 0) {
            throw new NotFoundError('Player', `Player with userId ${userId} not found`);
        }
    }

    async findPlayersByGameId(gameId: string): Promise<Player[]> {
        const docs = await this.model.find({ gameId });
        return docs.map(doc => Player.fromMongoose(doc));
    }
} 