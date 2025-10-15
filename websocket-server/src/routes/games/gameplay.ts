import express from "express";
import { InvalidSpaceError } from "../../custom-errors";
import {
    ActivateDayBreakData,
    activateDayBreakSchema,
    AllSpaceOptionsSchema,
    ExitGameData,
    ExitGameEvent,
    exitGameSchema,
    GetDayBreakCardsData,
    GetDayBreakCardsEvent,
    getDayBreakCardsSchema,
    LeaveGameData,
    leaveGameSchema,
    PlayerLeftData,
    PlayerLeftEvent,
} from "@shared-types";
import { asyncHandler } from "src/middleware/asyncHandler";
import { getSocketId } from "../../lib/utilities/common";
import { Request, Response } from "express";
import { requireHostForGameExit } from "src/middleware/hostOnly";
import { validateRequestBody } from "src/lib/utilities/routes";
import { GameEventEmitter } from "../../services";
import { deleteUserActiveGames } from "src/lib/utilities/db";
import {
    gameStateManager,
    getUpdatedUsers,
    userSocketManager,
} from "src/lib/utilities/game-routes";
import { NotFoundError, GameConflictError } from "../../custom-errors";

export default function createGameplayRouter(
    gameEventEmitter: GameEventEmitter
) {
    const router = express.Router();

    // GET /api/games/gameplay/:gameId/current-phase
    router.get(
        "/:gameId/current-phase",
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;
            const gameState = gameStateManager.getGameState(gameId);
            const currentPhase = gameState.getCurrentTransition().currentState;
            res.json(currentPhase);
        })
    );

    // Exits the game for everyone. Only the host can exit the game.
    // POST /api/games/gameplay/:gameId/exit
    router.post(
        "/:gameId/exit",
        requireHostForGameExit,
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<ExitGameData>(
                exitGameSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);

            userSocketManager.leaveGameRoom(userId, gameId);
            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                ExitGameEvent
            );
            res.status(200).json({ message: "Game exited successfully" });
        })
    );

    // POST /api/games/gameplay/:gameId/leave
    router.post(
        "/:gameId/leave",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<LeaveGameData>(
                leaveGameSchema,
                req
            );
            const gameId = req.params.gameId;

            try {
                const socketId = getSocketId(userId);
                const game = gameStateManager.getGame(gameId);
                const isLastPlayer = game.players.length === 1;

                if (!isLastPlayer) {
                    await deleteUserActiveGames(userId, gameId);
                }

                await gameStateManager.removePlayerFromGame(gameId, socketId);
                userSocketManager.leaveGameRoom(userId, gameId);
                const data: PlayerLeftData = await getUpdatedUsers(gameId);
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    PlayerLeftEvent,
                    data
                );
                res.status(200).json({ message: "Game left successfully" });
            } catch (error) {
                if (
                    (error instanceof NotFoundError &&
                        error.message.includes("Socket ID not found")) ||
                    error instanceof GameConflictError
                ) {
                    try {
                        const game = gameStateManager.getGame(gameId);
                        const isLastPlayer = game.players.length === 1;

                        if (!isLastPlayer) {
                            await deleteUserActiveGames(userId, gameId);
                        }
                        
                        res.status(200).json({
                            message: "Game left successfully",
                        });
                    } catch (dbError) {
                        console.error(
                            "Error cleaning up user active games:",
                            dbError
                        );
                        res.status(200).json({
                            message: "Game left successfully",
                        });
                    }
                    return;
                }

                throw error; // Re-throw other errors if not specific errors above
            }
        })
    );

    // POST /api/games/gameplay/:gameId/day-break-cards
    router.post("/:gameId/day-break-cards", async (req, res) => {
        const { userId } = validateRequestBody<GetDayBreakCardsData>(
            getDayBreakCardsSchema,
            req
        );
        const gameId = req.params.gameId;
        const socketId = getSocketId(userId);

        gameStateManager.verifyAndProcessGetDayBreakCardsEvent(
            gameId,
            async () => {
                const game = gameStateManager.getActiveGame(gameId);
                const dayBreakCards = game.getDayBreakCards(socketId);
                gameEventEmitter.emitToPlayers(
                    game.getActiveTeamPlayers(),
                    GetDayBreakCardsEvent,
                    dayBreakCards
                );
            }
        );

        res.status(200).json({
            message: "Day break cards fetched successfully",
        });
    });

    // POST /api/games/gameplay/:gameId/activate-day-break
    router.post("/:gameId/activate-day-break", async (req, res) => {
        const { userId, spaceOption } =
            validateRequestBody<ActivateDayBreakData>(
                activateDayBreakSchema,
                req
            );
        const gameId = req.params.gameId;
        const socketId = getSocketId(userId);

        gameStateManager.verifyAndProcessActivateDayBreakEvent(
            gameId,
            async () => {
                const game = gameStateManager.getActiveGame(gameId);

                if (
                    game.players.length === 2 &&
                    AllSpaceOptionsSchema.safeParse(spaceOption).error
                ) {
                    throw new InvalidSpaceError(spaceOption);
                }

                game.activateDayBreak(socketId, spaceOption);
            }
        );

        res.status(200).json({ message: "Day break activated successfully" });
    });

    return router;
}
