import { GameListing, GameplayGameState, SetupGameState, TeamHandsData, UserSetup } from "@shared-types";
import { GameStateManager } from "src/services";
import { UserSocketManager } from "src/services/UserSocketManager";
import { getUserProfilesByGameId } from "./db";
import { ActiveConGame, ConGame, Player } from "src/models";
import { NotFoundError } from "src/custom-errors";

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
        numPlayersTotal: game.numPlayersTotal,
    };
}

// Helper function to build game state data with team-based visibility
export function buildGameStateData(game: ActiveConGame, userId: string): GameplayGameState {
    const myTeam = game.getPlayerTeamByUserId(userId);
    const opponentTeam = myTeam ? game.getOpposingTeam(myTeam) : null;

    if (!myTeam || !opponentTeam) {
        throw new NotFoundError("Team not found");
    }
    
    // Build team-specific player data with visibility rules
    const myTeamPlayers = game.players
        .filter((p: Player) => myTeam.isPlayerOnTeam(p.userId))
        .map((p: Player) => ({
            userId: p.userId,
            socketId: p.socketId,
            sage: p.sage,
            level: p.level,
            hand: p.getHand(),
            deckCount: p.getDeck().length,
            discardCount: p.getDiscardPile().length,
        }));
        
    const opponentTeamPlayers = game.players
        .filter((p) => opponentTeam.isPlayerOnTeam(p.userId))
        .map((p) => ({
            userId: p.userId,
            socketId: p.socketId,
            sage: p.sage,
            level: p.level,
            deckCount: p.getDeck().length,
            discardCount: p.getDiscardPile().length,
        }));
    
    return {
        gameId: game.id,
        currentPhase: game.getCurrentPhase(),
        activeTeamNumber: game.getActiveTeam().getTeamNumber(),
        actionPoints: game.getActionPoints(),
        maxActionPoints: game.getMaxActionPoints(),
        teams: [
            {
                teamNumber: game.team1.getTeamNumber(),
                gold: game.team1.getGold(),
                battlefield: game.team1.getBattlefield().toClientFormat(),
                playerIds: game.team1.userIds,
            },
            {
                teamNumber: game.team2.getTeamNumber(),
                gold: game.team2.getGold(),
                battlefield: game.team2.getBattlefield().toClientFormat(),
                playerIds: game.team2.userIds,
            }
        ],
        creatureShop: game.getCurrentCreatureShopCards(),
        itemShop: game.getCurrentItemShopCards(),
        myTeam: {
            teamNumber: myTeam.getTeamNumber(),
            gold: myTeam.getGold(),
            battlefield: myTeam.getBattlefield().toClientFormat(),
            playerIds: myTeam.userIds,
        },
        myTeamPlayers,
        opponentTeamPlayers,
        hostUserId: game.getHost()?.userId || "",
        numPlayersTotal: game.numPlayersTotal,
    };
}

export function buildTeamHandsData(game: ActiveConGame, userId: string): TeamHandsData {
    const myTeam = game.getPlayerTeamByUserId(userId);

    if (!myTeam) {
        throw new NotFoundError("Team not found");
    }
    
    const myTeamPlayers = game.players
        .filter((p) => myTeam.isPlayerOnTeam(p.userId))
        .map((p) => ({
            userId: p.userId,
            socketId: p.socketId,
            sage: p.sage,
            level: p.level,
            hand: p.getHand(),
            deckCount: p.getDeck().length,
            discardCount: p.getDiscardPile().length,
        }));
    
    return { myTeamPlayers };
}