import { Request, Response, NextFunction } from "express";
import { GameStateManager } from "../services/GameStateManager";
import { NotFoundError, HostOnlyActionError } from "../custom-errors";
import { getSocketId } from "../lib/utilities/common";

const gameStateManager = GameStateManager.getInstance();

// Host-only middleware
export function requireHost(action?: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const gameId = req.params.gameId;
            const userId = req.body.userId;

            if (!gameId) {
                throw new NotFoundError("Game ID is required");
            }

            if (!userId) {
                throw new NotFoundError("User ID is required");
            }

            // Get the game and verify it exists
            const game = gameStateManager.getGame(gameId);
            const socketId = getSocketId(userId);
            const player = game.getPlayer(socketId);

            if (!player) {
                throw new NotFoundError("Player not found in game");
            }

            // Check if the player is the host
            if (!player.isGameHost) {
                throw new HostOnlyActionError(action);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

// Middleware for host-only actions
export const requireHostForAllSagesSelected = requireHost("select all sages");
export const requireHostForClearTeams = requireHost("clear teams");
export const requireHostForAllTeamsJoined = requireHost("join all teams");
export const requireHostForGameStart = requireHost("start the game");
export const requireHostForAllPlayersSetup = requireHost("finish setup");
export const requireHostForAllPlayersJoined = requireHost("join all players");
