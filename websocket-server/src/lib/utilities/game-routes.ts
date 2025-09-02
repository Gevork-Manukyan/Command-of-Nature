import { UserSetupDataResponse } from "@shared-types";
import { ValidationError } from "src/custom-errors";
import { GameStateManager } from "src/services";
import { UserSocketManager } from "src/services/UserSocketManager";
import { getUserProfilesByGameId } from "./db";

export const gameStateManager = GameStateManager.getInstance();
export const userSocketManager = UserSocketManager.getInstance();

export async function getUpdatedUsers(gameId: string): Promise<UserSetupDataResponse> {
    const game = gameStateManager.getGame(gameId);
    const userSetupData = await getUserProfilesByGameId(gameId);

    const response: UserSetupDataResponse = {
        userSetupData: [],
    };
    for (const user of userSetupData) {
        const { userId, username } = user;
        const player = game.getPlayerByUserId(userId);
        if (!player) {
            throw new ValidationError("Player not found", "player");
        }
        
        const isReady = player.isReady;
        const team = game.getPlayerTeamByUserId(userId)?.getTeamNumber() || null;
        const sage = player.sage;
        response.userSetupData.push({
            userId,
            username,
            sage,
            team,
            isReady,
        });
    }
    return response;
}