import { Model } from 'mongoose';
import { IBattlefield } from './db-model';
import { Battlefield } from './Battlefield';
import { NotFoundError } from '../../services/CustomError/BaseError';

/**
 * Service class for managing Battlefield instances in the database
 * @class BattlefieldService
 */
export class BattlefieldService {
    private model: Model<IBattlefield>;

    /**
     * Creates a new BattlefieldService instance
     * @param {Model<IBattlefield>} model - The Mongoose model for Battlefield
     */
    constructor(model: Model<IBattlefield>) {
        this.model = model;
    }

    async createBattlefield(numPlayersOnTeam: 1 | 2): Promise<Battlefield> {
        const battlefield = new Battlefield(numPlayersOnTeam);
        const doc = await this.model.create(battlefield.toMongoose());
        return Battlefield.fromMongoose(doc);
    }

    async findBattlefieldById(id: string): Promise<Battlefield> {
        const doc = await this.model.findById(id);
        if (!doc) {
            throw new NotFoundError('Battlefield', `Battlefield with id ${id} not found`);
        }
        return Battlefield.fromMongoose(doc);
    }

    async updateBattlefieldState(id: string, updates: Partial<Battlefield>): Promise<Battlefield> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Battlefield', `Battlefield with id ${id} not found`);
        }
        return Battlefield.fromMongoose(doc);
    }

    async updateBattlefieldSpace(id: string, spaceNumber: number, card: any): Promise<Battlefield> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: { [`fieldArray.${spaceNumber - 1}.value`]: card } },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Battlefield', `Battlefield with id ${id} not found`);
        }
        return Battlefield.fromMongoose(doc);
    }

    async deleteBattlefield(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('Battlefield', `Battlefield with id ${id} not found`);
        }
    }

    async findBattlefieldsByGameId(gameId: string): Promise<Battlefield[]> {
        const docs = await this.model.find({ gameId });
        return docs.map(doc => Battlefield.fromMongoose(doc));
    }
} 