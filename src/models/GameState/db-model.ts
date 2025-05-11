import { Document, Schema, model } from 'mongoose';
import { gameId, Transition } from '../../types';

type GameStateBase = {
    gameId: gameId;
    stateTransitionTable: Transition[];
    currentTransition: Transition;
}

export interface IGameState extends Document, GameStateBase {}

export const GameStateSchema = new Schema({
    gameId: { type: Schema.Types.ObjectId, required: true },
    stateTransitionTable: [{ type: Schema.Types.Mixed, required: true }],
    currentTransition: { type: Schema.Types.Mixed, required: true },
}); 

export const GameStateModel = model<IGameState>('GameState', GameStateSchema);