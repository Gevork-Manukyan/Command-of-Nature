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
    getDayBreakCardsSchema,
    LeaveGameData,
    leaveGameSchema,
    PlayerLeftData,
    PlayerLeftEvent,
    getUserGameStateSchema,
    getUserTeamHandsSchema,
    BattlefieldUpdatedEvent
} from "@shared-types";
import { asyncHandler } from "src/middleware/asyncHandler";
import { getSocketId } from "../../lib/utilities/common";
import { Request, Response } from "express";
import { requireHostForGameExit } from "src/middleware/hostOnly";
import { validateRequestBody, validateRequestQuery } from "src/lib/utilities/routes";
import { GameEventEmitter } from "../../services";
import { deleteUserActiveGames } from "src/lib/utilities/db";
import {
    buildGameStateData,
    buildTeamHandsData,
    gameStateManager,
    getUserSetupData,
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
                const data: PlayerLeftData = {
                    userSetupData: await getUserSetupData(game),
                    hostUserId: game.getHost()?.userId || ""
                };
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

    // GET /api/games/gameplay/:gameId/day-break-cards
    router.get("/:gameId/day-break-cards", asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestQuery<GetDayBreakCardsData>(
                getDayBreakCardsSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);

            const game = gameStateManager.getActiveGame(gameId);
            const dayBreakCards = game.getDayBreakCards(socketId);
            res.status(200).json(dayBreakCards);
        })
    );

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
                const activeTeam = game.getActiveTeam();
                gameEventEmitter.emitToAllPlayers(
                    gameId,
                    BattlefieldUpdatedEvent,
                    { 
                        teamNumber: activeTeam.getTeamNumber(),
                        battlefield: activeTeam.getBattlefield() 
                    }
                );
            }
        );

        res.status(200).json({ message: "Day break activated successfully" });
    });

    // GET /api/games/gameplay/:gameId/game-state?userId=xxx
    // Returns complete game state with team-based visibility
    router.get(
        "/:gameId/game-state",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestQuery(getUserGameStateSchema, req);
            const gameId = req.params.gameId;
            
            const game = gameStateManager.getActiveGame(gameId);
            const gameStateData = buildGameStateData(game, userId);
            
            res.json(gameStateData);
        })
    );

    // GET /api/games/gameplay/:gameId/team-hands?userId=xxx
    // Returns hands for the player's team
    router.get(
        "/:gameId/team-hands",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestQuery(getUserTeamHandsSchema, req);
            const gameId = req.params.gameId;
            
            const game = gameStateManager.getActiveGame(gameId);
            const teamHands = buildTeamHandsData(game, userId);
            
            res.json(teamHands);
        })
    );

    return router;
}
