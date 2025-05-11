import { Document, Schema } from 'mongoose';
import { ElementalCard } from '../../types';
import { SpaceOption } from '../../types/types';
import { Direction } from './BattlefieldSpace';

// Define the base type
type BattlefieldSpaceBase = {
    spaceNumber: SpaceOption;
    value: ElementalCard | null;
    connections: {
        [key in Direction]?: number | null;
    };
};

// Extend Document for MongoDB
export interface IBattlefieldSpace extends Document, BattlefieldSpaceBase {}

// Define the schema
export const BattlefieldSpaceSchema = new Schema<IBattlefieldSpace>({
    spaceNumber: { type: Number, required: true },
    value: { type: Schema.Types.Mixed, required: false, default: null },
    connections: { type: Schema.Types.Mixed, required: true, default: null }
}); 