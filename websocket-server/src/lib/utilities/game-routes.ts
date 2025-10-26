import { GameListing, SetupGameState, UserSetup } from "@shared-types";
import { GameStateManager } from "src/services";
import { UserSocketManager } from "src/services/UserSocketManager";
import { getUserProfilesByGameId } from "./db";
import { ConGame } from "src/models";

export const gameStateManager = GameStateManager.getInstance();
export const userSocketManager = UserSocketManager.getInstance();

export function createGameListing(game: ConGame): GameListing {
    return {
        id: game.id,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length,
    };
}

export function getTeams(game: ConGame): { [key in 1 | 2]: string[] } {
    return {
        1: game.team1.userIds,
        2: game.team2.userIds,
    };
}

export async function getUserSetupDataByGameId(gameId: string): Promise<UserSetup[]> {
    const game = gameStateManager.getGame(gameId);
    return await getUserSetupData(game);
}

export async function getUserSetupData(game: ConGame): Promise<UserSetup[]> {
    const userProfiles = await getUserProfilesByGameId(game.id);
    return game.players.map(player => ({
        userId: player.userId,
        username: userProfiles.find(profile => profile.userId === player.userId)?.username || player.userId,
        sage: player.sage,
        team: game.getPlayerTeamByUserId(player.userId)?.getTeamNumber() || null,
        isReady: player.isReady,
    }));
}

export async function buildSetupGameStateData(game: ConGame): Promise<SetupGameState> {
    const userSetupData: UserSetup[] = await getUserSetupData(game);

    // Get the current phase from the game state
    const gameState = gameStateManager.getGameState(game.id);
    const currentPhase = gameState.getCurrentTransition().currentState;

    return {
        gameId: game.id,
        currentPhase,
        userSetupData,
        availableSages: game.getAvailableSages(),
        teams: {
            1: game.team1.userIds,
            2: game.team2.userIds,
        },
        hostUserId: game.getHost()?.userId || "",
    };
}