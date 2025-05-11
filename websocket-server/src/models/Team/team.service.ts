import { Model } from 'mongoose';
import { ITeam } from './db-model';
import { Team } from './Team';
import { NotFoundError } from '../../services/CustomError/BaseError';

/**
 * Service class for managing Team instances in the database
 * @class TeamService
 */
export class TeamService {
    private model: Model<ITeam>;

    /**
     * Creates a new TeamService instance
     * @param {Model<ITeam>} model - The Mongoose model for Team
     */
    constructor(model: Model<ITeam>) {
        this.model = model;
    }

    async createTeam(teamSize: 1 | 2, teamNumber: 1 | 2): Promise<Team> {
        const team = new Team(teamSize, teamNumber);
        const doc = await this.model.create(team.toMongoose());
        return Team.fromMongoose(doc);
    }

    async findTeamById(id: string): Promise<Team> {
        const doc = await this.model.findById(id);
        if (!doc) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
        return Team.fromMongoose(doc);
    }

    async updateTeamState(id: string, updates: Partial<Team>): Promise<Team> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
        return Team.fromMongoose(doc);
    }

    async addPlayerToTeam(id: string, player: any): Promise<Team> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $push: { players: player } },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
        return Team.fromMongoose(doc);
    }

    async removePlayerFromTeam(id: string, playerId: string): Promise<Team> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $pull: { players: { socketId: playerId } } },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
        return Team.fromMongoose(doc);
    }

    async deleteTeam(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
    }

    async findTeamsByGameId(gameId: string): Promise<Team[]> {
        const docs = await this.model.find({ gameId });
        return docs.map(doc => Team.fromMongoose(doc));
    }
} 