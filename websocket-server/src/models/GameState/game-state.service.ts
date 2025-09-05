import { GameState } from "./GameState";
import { NotFoundError } from "../../custom-errors";
import { TransitionEvent } from "../../../../shared-types/src/gamestate-types";
import { prisma } from "../../lib/prisma";
import { GameState as GameStatePrisma } from "@prisma/client";

/**
 * Service class for managing GameState instances in the database
 * @class GameStateService
 */
export class GameStateService {
    constructor() {}

    async createGameState(gameId: string): Promise<GameStatePrisma> {
        const gameState = new GameState(gameId);
        const doc = await prisma.gameState.create({
            data: {
                gameId: gameState.gameId,
                currentTransition: gameState.getCurrentTransition(),
            },
        });
        return doc;
    }

    async findGameStateById(id: string): Promise<GameStatePrisma> {
        const doc = await prisma.gameState.findUnique({
            where: {
                id: id,
            },
        });

        if (!doc) {
            throw new NotFoundError(
                "GameState",
                `GameState with id ${id} not found`
            );
        }

        return doc;
    }

    async findGameStateByGameId(gameId: string): Promise<GameStatePrisma> {
        const doc = await prisma.gameState.findUnique({
            where: {
                gameId: gameId,
            },
        });

        if (!doc) {
            throw new NotFoundError(
                "GameState",
                `GameState for game ${gameId} not found`
            );
        }

        return doc;
    }

    async updateGameState(id: string, updates: GameState): Promise<GameStatePrisma> {
        const doc = await prisma.gameState.update({
            where: { id: id },
            data: updates.toPrismaObject(),
        });

        if (!doc) {
            throw new NotFoundError(
                "GameState",
                `GameState with id ${id} not found`
            );
        }

        return doc;
    }

    async updateGameStateByGameId(
        gameId: string,
        updates: GameState
    ): Promise<GameStatePrisma> {
        const doc = await prisma.gameState.update({
            where: { gameId: gameId },
            data: updates.toPrismaObject(),
        });

        if (!doc) {
            throw new NotFoundError(
                "GameState",
                `GameState for game ${gameId} not found`
            );
        }

        return doc;
    }

    async deleteGameState(id: string): Promise<void> {
        const result = await prisma.gameState.delete({
            where: { id: id },
        });

        if (!result) {
            throw new NotFoundError(
                "GameState",
                `GameState with id ${id} not found`
            );
        }
    }

    async deleteGameStateByGameId(gameId: string): Promise<void> {
        const result = await prisma.gameState.delete({
            where: { gameId: gameId },
        });

        if (!result) {
            throw new NotFoundError(
                "GameState",
                `GameState for game ${gameId} not found`
            );
        }
    }
}
