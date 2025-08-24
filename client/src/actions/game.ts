"use server";

import { prisma } from "@/lib/server/prisma";
import { GameListing } from "@shared-types";

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
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length
    }));
}