"use server";

import { prisma } from "@/lib/server/prisma";
import { GameListing, GameListingSchema } from "@shared-types";

export async function getUserActiveGames(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: { userGames: true },
    });
}

export async function isUserInGame(
    userId: string,
    gameId: string
): Promise<GameListing | null> {
    const userGame = await prisma.userGame.findUnique({
        where: { userId_gameId: { userId, gameId } },
    });

    if (!userGame) return null;

    const game = await prisma.conGame.findUnique({
        where: { id: gameId },
        select: {
            id: true,
            gameName: true,
            isPrivate: true,
            numPlayersTotal: true,
            players: true,
        },
    });

    if (!game) return null;

    return GameListingSchema.parse({
        id: game.id,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal as 2 | 4,
        numCurrentPlayers: game.players.length,
    });
}
