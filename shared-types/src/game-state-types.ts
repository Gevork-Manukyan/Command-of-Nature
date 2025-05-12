import { Card, Decklist, Sage } from './card-types';

export type GameListing = {
    id: string;
    gameName: string;
    isPrivate: boolean;
    numPlayersTotal: number;
    numCurrentPlayers: number;
}

export type Player = {
    socketId: string;
    userId: string;
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