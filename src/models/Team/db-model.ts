import { Document, Schema } from 'mongoose';
import { PlayerSchema, IPlayer } from '../Player/db-model';
import { IBattlefield, BattlefieldSchema } from '../Battlefield/db-model';
import { Card } from '../../types';

// Define the base type
type TeamBase = {
    players: IPlayer[];
    battlefield: IBattlefield;
    teamNumber: 1 | 2;
    teamSize: 1 | 2;
    gold: number;
    maxGold: 12 | 20;
    removedCards: Card[];
}

// Extend Document for MongoDB
export interface ITeam extends Document, TeamBase {}

// Define the schema
export const TeamSchema = new Schema({
    players: { type: [PlayerSchema], required: true },
    battlefield: { type: BattlefieldSchema, required: true },
    teamNumber: { type: Number, required: true, enum: [1, 2] },
    teamSize: { type: Number, required: true, enum: [1, 2] },
    gold: { type: Number, required: true },
    maxGold: { type: Number, required: true, enum: [12, 20] },
    removedCards: [{ type: Schema.Types.Mixed, required: true }]
}); 