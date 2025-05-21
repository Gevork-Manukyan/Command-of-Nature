import { NotFoundError, ValidationError } from "../../services/CustomError/BaseError";
import { Card, Sage, Decklist, IPlayerMethods, IPlayerData } from "shared-types";
import { drawCardFromDeck, getSageDecklist } from "../../lib/utilities";
import { IPlayer } from './db-model';
import { Types } from 'mongoose';

/**
 * Represents a player in the Command of Nature game
 * @class Player
 */
export class Player implements IPlayerMethods, IPlayerData {
  userId: string;           // User ID (persistent)
  socketId: string;         // Current socket ID (temporary)
  isReady: boolean = false;
  isSetup: boolean = false;
  hasChosenWarriors: boolean = false;
  isGameHost: boolean = false;
  sage: Sage | null = null;
  decklist: Decklist | null = null;
  level: number = 1;
  hand: Card[] = [];
  deck: Card[] = [];
  discardPile: Card[] = [];

  // Getters to satisfy IPlayerData interface
  getIsReady() { return this.isReady; }
  getIsSetup() { return this.isSetup; }
  getHasChosenWarriors() { return this.hasChosenWarriors; }
  getIsGameHost() { return this.isGameHost; }
  getSage() { return this.sage; }
  getDecklist() { return this.decklist; }
  getLevel() { return this.level; }
  getHand() { return this.hand; }
  getDeck() { return this.deck; }
  getDiscardPile() { return this.discardPile; }

  /**
   * Creates a new Player instance
   * @param {string} userId - The unique identifier for the user
   * @param {string} socketId - The current socket connection ID
   * @param {boolean} [isGameHost=false] - Whether this player is the game host
   */
  constructor(userId: string, socketId: string, isGameHost = false) {
    this.userId = userId;
    this.socketId = socketId;
    this.isGameHost = isGameHost;
  }

  // Update socket ID when user reconnects
  updateSocketId(newSocketId: string) {
    this.socketId = newSocketId;
  }

  setIsReady(value: boolean) {
    this.isReady = value;
  }

  toggleReady() {
    this.isReady = !this.isReady;
  }

  setIsSetup(value: boolean) {
    this.isSetup = value;
  }

  setHasChosenWarriors(value: boolean) {
    this.hasChosenWarriors = value;
  }

  setIsGameHost(value: boolean) {
    this.isGameHost = value;
  }

  setSage(sage: Player['sage']) {
    this.sage = sage;
  }

  setDecklist(decklist: Decklist) {
    this.decklist = decklist;
  }

  levelUp() {
    if (this.level === 8) return;
    this.level += 1;
  }

  addCardToHand(card: Card) {
    this.hand.push(card);
  }

  removeCardFromHand(index: number) {
    if (index < 0 || index >= this.hand.length) throw new ValidationError("Invalid index for hand", "INVALID_INDEX")
    return this.hand.splice(index, 1)[0];
  }

  addCardToDeck(card: Card) {
    this.deck.push(card)
  }

  addCardsToDeck(cards: Card[]) {
    this.deck = this.deck.concat(cards)
  }

  addCardToDiscardPile(card: Card) {
    this.discardPile.push(card);
  }

  removeCardFromDiscardPile(index: number) {
    if (index < 0 || index >= this.discardPile.length) throw new ValidationError("Invalid index for discard pile", "INVALID_INDEX")
    return this.discardPile.splice(index, 1)[0];
  }

  getElement() {
    if (!this.sage) throw new NotFoundError("Sage", "Player does not have an element")
    if (!this.decklist) throw new NotFoundError("Decklist", "Player does not have an element")
    
    return this.decklist.sage.element;
  }

  initDeck() {
    if (!this.isReady) throw new ValidationError("Cannot initialize the deck. Player is not ready", "isReady")
    this.setDecklist(getSageDecklist(this.sage))

    const decklist = this.decklist!
    const basicStarter = decklist.basic
    this.addCardsToDeck([basicStarter, ...decklist.items])
  }

  initHand() {
    this.drawCard();
    this.drawCard();
    this.drawCard();
    this.drawCard();
    this.drawCard();
  }

  finishPlayerSetup() {
    if (!this.isReady) throw new NotFoundError("Player", "Player is not ready");
    if (!this.hasChosenWarriors) throw new NotFoundError("Warriors", "Player has not chosen warriors");
    this.isSetup = true;
  }

  cancelPlayerSetup() {
    this.isSetup = false;
  }

  
  /* -------- GAME ACTIONS -------- */

  getPlayerState() {
    return {
      sage: this.sage,
      level: this.level,
      hand: this.hand,
    }
  }

  drawCard() {
    const drawnCard = drawCardFromDeck(this.deck)
    this.addCardToHand(drawnCard)
  }

  // Convert from Mongoose document to runtime instance
  static fromMongoose(doc: Omit<IPlayer, '_id'> | IPlayer): Player {
    const player = new Player(doc.userId.toString(), doc.socketId, doc.isGameHost);
    
    // Set up properties
    player.isReady = doc.isReady;
    player.isSetup = doc.isSetup;
    player.hasChosenWarriors = doc.hasChosenWarriors;
    player.sage = doc.sage;
    player.decklist = doc.decklist;
    player.level = doc.level;
    player.hand = doc.hand;
    player.deck = doc.deck;
    player.discardPile = doc.discardPile;

    return player;
  }

  // Convert runtime instance to plain object for Mongoose
  toMongoose(): Omit<IPlayer, '_id'> {
    return {
      userId: new Types.ObjectId(this.userId),
      socketId: this.socketId,
      isReady: this.isReady,
      isSetup: this.isSetup,
      hasChosenWarriors: this.hasChosenWarriors,
      isGameHost: this.isGameHost,
      sage: this.sage,
      decklist: this.decklist,
      level: this.level,
      hand: this.hand,
      deck: this.deck,
      discardPile: this.discardPile
    } as Omit<IPlayer, '_id'>;
  }

  // Static utility methods
  static findPlayerById(players: Player[], playerId: string): Player | undefined {
    return players.find(player => player.socketId === playerId);
  }

  static findOtherPlayerById(players: Player[], playerId: string): Player | undefined {
    return players.find(player => player.socketId !== playerId);
  }

  static filterOutPlayerById(players: Player[], playerId: string): Player[] {
    return players.filter(player => player.socketId !== playerId);
  }
}
