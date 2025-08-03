import { Card } from './card-classes';
import { Sage } from './card-types';
import { Decklist } from './Decklist';

export interface IPlayerData {
    userId: string;
    isReady: boolean;
    isSetup: boolean;
    hasChosenWarriors: boolean;
    isGameHost: boolean;
    sage: Sage | null;
    decklist: Decklist | null;
    level: number;
    hand: Card[];
    deck: Card[];
    discardPile: Card[];
}

export interface IPlayerMethods {
    setIsReady(value: boolean): void;
    toggleReady(): void;
    setIsSetup(value: boolean): void;
    setHasChosenWarriors(value: boolean): void;
    setIsGameHost(value: boolean): void;
    setSage(sage: Sage | null): void;
    setDecklist(decklist: Decklist): void;
    levelUp(): void;
    addCardToHand(card: Card): void;
    removeCardFromHand(index: number): Card;
    addCardToDeck(card: Card): void;
    addCardsToDeck(cards: Card[]): void;
    addCardToDiscardPile(card: Card): void;
    removeCardFromDiscardPile(index: number): Card;
    getElement(): string;
    initDeck(): void;
    initHand(): void;
    finishPlayerSetup(): void;
    cancelPlayerSetup(): void;
    getPlayerState(): { sage: Sage | null; level: number; hand: Card[] };
    drawCard(): void;
}

export type Player = IPlayerMethods & IPlayerData; 