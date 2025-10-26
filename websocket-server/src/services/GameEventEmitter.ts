import { Server, Namespace } from "socket.io";
import { gameId } from "../types";
import { ConGame, Player } from "../models";
import { InternalServerError } from "../custom-errors";
import {  AllPlayersSetupStatusEvent, AllPlayersSetupStatusData } from "@shared-types";

export class GameEventEmitter {
    private static instance: GameEventEmitter;
    private io: Server | Namespace;

    private constructor(io: Server | Namespace) {
        this.io = io;
    }

    static getInstance(io?: Server | Namespace): GameEventEmitter {
        if (!GameEventEmitter.instance) {
            if (!io)
                throw new InternalServerError(
                    "IO parameter is required when creating the first GameEventEmitter instance"
                );
            GameEventEmitter.instance = new GameEventEmitter(io);
        }

        return GameEventEmitter.instance;
    }

    /**
     * Emits an event to a player
     * @param socketId - The player socket id
     * @param eventName - The event name
     * @param data - The data to send
     */
    emitToPlayer(socketId: string, eventName: string, data: any = null) {
        this.io.to(socketId).emit(eventName, data);
    }

    /**
     * Alias for emitToPlayer for clarity
     * @param socketId - The player socket id
     * @param eventName - The event name
     * @param data - The data to send
     */
    emitToUser(socketId: string, eventName: string, data: any = null) {
        this.emitToPlayer(socketId, eventName, data);
    }

    /**
     * Emits an event to all players in the game
     * @param players - The players to emit to
     * @param eventName - The event name
     * @param data - The data to send
     */
    emitToPlayers(players: Player[], eventName: string, data: any = null) {
        players.forEach((player) => {
            this.emitToPlayer(player.socketId, eventName, data);
        });
    }

    /**
     * Emits an event to the teammate of the player
     * @param game - The game
     * @param playerUserId - The player user id
     * @param eventName - The event name
     * @param data - The data to send
     */
    emitToTeammate(
        game: ConGame,
        playerUserId: string,
        eventName: string,
        data: any = null
    ) {
        const teammate = game.getPlayerTeammate(playerUserId);
        if (teammate) {
            this.emitToPlayer(teammate.socketId, eventName, data);
        }
    }

    /**
     * Emits an event to all players in the game except the sender
     * @param gameId - The game id
     * @param senderSocketId - The socket id of the sender
     * @param eventName - The event name
     * @param data - The data to send
     */
    emitToOtherPlayersInRoom(
        gameId: gameId,
        senderSocketId: string,
        eventName: string,
        data: any = null
    ) {
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
     * Checks if all players are setup and emits status to the host
     * @param game - The game instance
     */
    checkAndEmitAllPlayersSetupStatus(game: ConGame) {
        const allPlayersSetup = game.checkAllPlayersFinishedSetup();
        const host = game.getHost();
        
        if (host) {
            this.emitToPlayer(
                host.socketId,
                AllPlayersSetupStatusEvent,
                { allPlayersSetup } as AllPlayersSetupStatusData
            );
        }
    }
}
