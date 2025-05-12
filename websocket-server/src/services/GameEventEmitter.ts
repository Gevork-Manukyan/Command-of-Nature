import { Server, Namespace } from "socket.io";
import { gameId } from "../types";
import { Player } from "../models";
import { GameStateManager } from "./GameStateManager";

export class GameEventEmitter {
  private static instance: GameEventEmitter;
  private io: Server | Namespace;
  private gameStateManager: GameStateManager;

  private constructor(io: Server | Namespace) {
    this.io = io;
    this.gameStateManager = GameStateManager.getInstance();
  }

  static getInstance(io: Server | Namespace): GameEventEmitter {
    if (!GameEventEmitter.instance) {
      GameEventEmitter.instance = new GameEventEmitter(io);
    }
    return GameEventEmitter.instance;
  }

  /**
   * Emits an event to a player
   * @param playerId - The player id
   * @param eventName - The event name
   * @param data - The data to send
   */
  emitToPlayer(playerId: string, eventName: string, data: any = null) {
    this.io.to(playerId).emit(eventName, data);
  }

  /**
   * Emits an event to all players in the game
   * @param players - The players to emit to
   * @param eventName - The event name
   * @param data - The data to send
   */
  emitToPlayers(players: Player[], eventName: string, data: any = null) {
    players.forEach(player => {
      this.emitToPlayer(player.socketId, eventName, data);
    });
  }

  /**
   * Emits an event to all players in the game except the sender
   * @param gameId - The game id
   * @param senderSocketId - The socket id of the sender
   * @param eventName - The event name
   * @param data - The data to send
   */
  emitToOtherPlayersInRoom(gameId: gameId, senderSocketId: string, eventName: string, data: any = null) {
    this.io.in(gameId).except(senderSocketId).emit(eventName, data);
  }  

  /**
   * Emits an event to all players in the game
   * @param gameId - The game id
   * @param eventName - The event name
   * @param data - The data to send
   */
  emitToAllPlayers(gameId: gameId, eventName: string, data: any = null) {
    this.io.in(gameId).emit(eventName, data);
  }

  /**
   * Emits an event to all players in the game to pick warriors
   * @param gameId - The game id
   */
  emitPickWarriors(gameId: gameId) {
    const game = this.gameStateManager.getGame(gameId);
    game.players.forEach(player => {
      this.emitToPlayer(player.socketId, "pick-warriors", player.decklist);
    })
  }

  /**
   * Emits an event to all players in the game to start their turn
   * @param activePlayers - The active players
   * @param waitingPlayers - The waiting players
   */
  emitStartTurn(activePlayers: Player[], waitingPlayers: Player[]) {
    this.emitToPlayers(activePlayers, "start-turn");
    this.emitToPlayers(waitingPlayers, "waiting-turn");
  }
}