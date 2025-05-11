import { Document, Schema, Types } from 'mongoose';
import { Card, Decklist, Sage } from '../../types';

export interface IPlayer extends Document {
    userId: Types.ObjectId;  // Reference to User
    socketId: string;        // Current socket ID (temporary)
    isReady: boolean;
    isSetup: boolean;
    hasChosenWarriors: boolean;
    isGameHost: boolean;
    sage: Sage;
    decklist: Decklist;
    level: number;
    hand: Card[];
    deck: Card[];
    discardPile: Card[];
}

export const PlayerSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    socketId: { type: String, unique: true, required: true },
    isReady: { type: Boolean, default: false },
    isSetup: { type: Boolean, default: false },
    hasChosenWarriors: { type: Boolean, default: false },
    isGameHost: { type: Boolean, default: false },
    sage: { type: Schema.Types.Mixed, required: true },
    decklist: { type: Schema.Types.Mixed, required: true },
    level: { type: Number, required: true },
    hand: [{ type: Schema.Types.Mixed, required: true }],
    deck: [{ type: Schema.Types.Mixed, required: true }],
    discardPile: [{ type: Schema.Types.Mixed, required: true }]
});