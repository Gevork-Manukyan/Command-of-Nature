import { Document, model, Schema, Types } from 'mongoose';
import { TeamOrder, ElementalCard, ItemCard } from '../../types';
import { IPlayer, PlayerSchema } from '../Player/db-model';
import { ITeam, TeamSchema } from '../Team/db-model';

// Define the base type
type ConGameBase = {
    gameName: string;
    isPrivate: boolean;
    password?: string;
    isStarted: boolean;
    hasFinishedSetup: boolean;
    numPlayersTotal: 2 | 4;
    numPlayersReady: number;
    numPlayersFinishedSetup: number;
    players: Omit<IPlayer, '_id'>[];
    team1: Omit<ITeam, '_id'>;
    team2: Omit<ITeam, '_id'>;
    teamOrder: TeamOrder;
    creatureShop: ElementalCard[];
    itemShop: ItemCard[];
    currentCreatureShopCards: ElementalCard[];
    currentItemShopCards: ItemCard[];

    // Active game fields
    isActive: boolean;
    activeTeam?: 'first' | 'second';
    currentPhase?: 'phase1' | 'phase2' | 'phase3' | 'phase4';
    actionPoints?: number;
    maxActionPoints?: 3 | 6;
}

// Extend Document for MongoDB
export interface IConGame extends Document<Types.ObjectId>, ConGameBase {}

// Define the schema
export const ConGameSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    gameName: { type: String, required: true },
    isPrivate: { type: Boolean, required: true },
    password: { type: String, required: false },
    isStarted: { type: Boolean, required: true },
    hasFinishedSetup: { type: Boolean, required: true },
    numPlayersTotal: { type: Number, required: true, enum: [2, 4] },
    numPlayersReady: { type: Number, required: true },
    numPlayersFinishedSetup: { type: Number, required: true },
    players: { type: [PlayerSchema], required: true },
    team1: { type: TeamSchema, required: true },
    team2: { type: TeamSchema, required: true },
    teamOrder: { type: Object, required: true },
    creatureShop: [{ type: Schema.Types.Mixed, required: true }],
    itemShop: [{ type: Schema.Types.Mixed, required: true }],
    currentCreatureShopCards: [{ type: Schema.Types.Mixed, required: true }],
    currentItemShopCards: [{ type: Schema.Types.Mixed, required: true }],

    // Active game fields
    isActive: { type: Boolean, default: false },
    activeTeam: { type: String, enum: ['first', 'second'] },
    currentPhase: { type: String, enum: ['phase1', 'phase2', 'phase3', 'phase4'] },
    actionPoints: { type: Number },
    maxActionPoints: { type: Number, enum: [3, 6] }
}); 

export const ConGameModel = model<IConGame>('ConGame', ConGameSchema);