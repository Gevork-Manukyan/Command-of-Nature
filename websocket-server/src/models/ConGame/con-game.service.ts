import { ConGame, ActiveConGame } from "./ConGame";
import { NotFoundError } from "../../custom-errors";
import { prisma } from "../../lib/prisma";
import { Player } from "../Player/Player";
import { ConGame as ConGamePrisma } from "@prisma/client";

/**
 * Service class for managing ConGame instances in the database
 * @class ConGameService
 */
export class ConGameService {
    constructor() {}

    async createGame(
        numPlayers: ConGame["numPlayersTotal"],
        gameName: ConGame["gameName"],
        isPrivate: ConGame["isPrivate"],
        password: ConGame["password"]
    ): Promise<ConGamePrisma> {
        const game = new ConGame(numPlayers, gameName, isPrivate, password);

        try {
            const doc = await prisma.conGame.create({
                data: game.toPrismaObject(),
            });
            game.setId(doc.id);
            return doc;
        } catch (error) {
            throw new Error("Failed to create game");
        }
    }

    async findAllGames(): Promise<ConGamePrisma[]> {
        const games = await prisma.conGame.findMany();
        return games;
    }

    async findAllActiveGames(): Promise<ConGamePrisma[]> {
        const games = await prisma.conGame.findMany({
            where: {
                isActive: true,
            },
        });

        return games;
    }

    async findGameById(id: string): Promise<ConGamePrisma> {
        const doc = await prisma.conGame.findUnique({
            where: {
                id: id,
            },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async findActiveGameById(id: string): Promise<ConGamePrisma> {
        const doc = await prisma.conGame.findUnique({
            where: {
                id: id,
            },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async updateGame(id: string, game: ConGame): Promise<ConGamePrisma> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: game.toPrismaObject(),
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async updateActiveGameState(id: string, game: ActiveConGame): Promise<ConGamePrisma> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: game.toPrismaObject(),
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async addPlayerToGame(id: string, player: Player): Promise<ConGamePrisma> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: { players: { push: player.toPrismaObject() } },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async removePlayerFromGame(id: string, playerId: string): Promise<ConGamePrisma> {
        // TODO: make sure this is correct
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: { players: { push: { socketId: playerId } } },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async updateShopCards(
        id: string,
        updates: {
            currentCreatureShopCards?: any[];
            currentItemShopCards?: any[];
        }
    ): Promise<ConGamePrisma> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: updates,
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return doc;
    }

    async deleteGame(id: string): Promise<void> {
        const result = await prisma.conGame.delete({
            where: { id: id },
        });

        if (!result) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }
    }

    async findGamesByStatus(isActive: boolean): Promise<ConGamePrisma[]> {
        const games = await prisma.conGame.findMany({
            where: { isActive: isActive },
        });

        return games;
    }
}
