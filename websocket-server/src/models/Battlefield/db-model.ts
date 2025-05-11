import { Document, Schema } from 'mongoose';
import { IBattlefieldSpace, BattlefieldSpaceSchema } from '../BattlefieldSpace/db-model';

// Define the base type
type BattlefieldBase = {
    fieldArray: IBattlefieldSpace[];
    numPlayersOnTeam: 1 | 2;
};

// Extend Document for MongoDB
export interface IBattlefield extends Document, BattlefieldBase {}

// Define the schema
export const BattlefieldSchema = new Schema<IBattlefield>({
    fieldArray: { type: [BattlefieldSpaceSchema], required: true },
    numPlayersOnTeam: { type: Number, required: true, enum: [1, 2] }
});