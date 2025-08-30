import { redirect } from "next/navigation";
import { auth } from "./auth";
import { GameListing } from "@shared-types";
import { ConGame } from "@prisma/client";

/**
 * Ensures the user is authenticated. If not, redirects to /login.
 * Returns the session if authenticated.
 */
export async function requireUserSession() {
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }
    return session;
}

export function createGameListing(game: ConGame): GameListing {
  return {
      id: game.id,
      gameName: game.gameName,
      isPrivate: game.isPrivate,
      numPlayersTotal: game.numPlayersTotal as 2 | 4,
      numCurrentPlayers: game.players.length,
    }
  }