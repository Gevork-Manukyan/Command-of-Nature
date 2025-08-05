
import { Team } from './Team';
import { NotFoundError } from '../../services/CustomError/BaseError';

//TODO: not used
/**
 * Service class for managing Team instances in the database
 * @class TeamService
 */
export class TeamService {
    constructor() {}

    async createTeam(teamSize: 1 | 2, teamNumber: 1 | 2): Promise<Team> {
        const team = new Team(teamSize, teamNumber);
        const doc = await this.model.create(team.toPrismaObject());
        return Team.fromPrisma(doc);
    }

    async findTeamById(id: string): Promise<Team> {
        const doc = await this.model.findById(id);
        if (!doc) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
        return Team.fromPrisma(doc);
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
        return Team.fromPrisma(doc);
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
        return Team.fromPrisma(doc);
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
        return Team.fromPrisma(doc);
    }

    async deleteTeam(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('Team', `Team with id ${id} not found`);
        }
    }

    async findTeamsByGameId(gameId: string): Promise<Team[]> {
        const docs = await this.model.find({ gameId });
        return docs.map(doc => Team.fromPrisma(doc));
    }
} 