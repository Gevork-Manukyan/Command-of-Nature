import { ConGame, ActiveConGame } from "./ConGame";
import { NotFoundError } from "../../custom-errors";
import { prisma } from "../../lib/prisma";
import { Player } from "../Player/Player";

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
    ): Promise<ConGame> {
        const game = new ConGame(numPlayers, gameName, isPrivate, password);

        try {
            const doc = await prisma.conGame.create({
                data: game.toPrismaObject(),
            });
            game.setId(doc.id);
        } catch (error) {
            throw new Error("Failed to create game");
        }

        return game;
    }

    async findAllGames(): Promise<ConGame[]> {
        const games = await prisma.conGame.findMany();
        return games.map((game) => ConGame.fromPrisma(game));
    }

    async findAllActiveGames(): Promise<ActiveConGame[]> {
        const games = await prisma.conGame.findMany({
            where: {
                isActive: true,
            },
        });

        return games.map((game) => ActiveConGame.fromPrisma(game));
    }

    async findGameById(id: string): Promise<ConGame> {
        const doc = await prisma.conGame.findUnique({
            where: {
                id: id,
            },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ConGame.fromPrisma(doc);
    }

    async findActiveGameById(id: string): Promise<ActiveConGame> {
        const doc = await prisma.conGame.findUnique({
            where: {
                id: id,
            },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ActiveConGame.fromPrisma(doc);
    }

    async updateGameState(id: string, game: ConGame): Promise<ConGame> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: game.toPrismaObject(),
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ConGame.fromPrisma(doc);
    }

    async updateActiveGameState(
        id: string,
        game: ActiveConGame
    ): Promise<ActiveConGame> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: game.toPrismaObject(),
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ActiveConGame.fromPrisma(doc);
    }

    async addPlayerToGame(id: string, player: Player): Promise<ConGame> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: { players: { push: player.toPrismaObject() } },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ConGame.fromPrisma(doc);
    }

    async removePlayerFromGame(id: string, playerId: string): Promise<ConGame> {
        // TODO: make sure this is correct
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: { players: { push: { socketId: playerId } } },
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ConGame.fromPrisma(doc);
    }

    async updateShopCards(
        id: string,
        updates: {
            currentCreatureShopCards?: any[];
            currentItemShopCards?: any[];
        }
    ): Promise<ConGame> {
        const doc = await prisma.conGame.update({
            where: { id: id },
            data: updates,
        });

        if (!doc) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }

        return ConGame.fromPrisma(doc);
    }

    async deleteGame(id: string): Promise<void> {
        const result = await prisma.conGame.delete({
            where: { id: id },
        });

        if (!result) {
            throw new NotFoundError("ConGame", `Game with id ${id} not found`);
        }
    }

    async findGamesByStatus(isActive: boolean): Promise<ConGame[]> {
        const games = await prisma.conGame.findMany({
            where: { isActive: isActive },
        });

        return games.map((game) =>
            isActive ? ActiveConGame.fromPrisma(game) : ConGame.fromPrisma(game)
        );
    }
}
