"use server";

import { prisma } from "@/lib/server/prisma";
import { ConGameSchema, GameListing } from "@shared-types";

export async function isPlayerHostOfGame(userId: string, gameId: string): Promise<boolean> {
    const game = await prisma.conGame.findUnique({
        where: {
            id: gameId
        }
    })

    if (!game) return false;
    const validatedGame = ConGameSchema.parse(game);

    const player = validatedGame.players.find((player) => player?.userId === userId);
    return player?.isGameHost || false;
}

export async function getGameListings(haveStarted: boolean): Promise<GameListing[]> {
    const games = await prisma.conGame.findMany({
        where: {
            isActive: haveStarted
        }
    })

    return games.map((game) => ({
        id: game.id,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal as 2 | 4,
        numCurrentPlayers: game.players.length
    }));
}