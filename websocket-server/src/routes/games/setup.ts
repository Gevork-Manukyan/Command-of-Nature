import express from "express";
import { GameEventEmitter, GameStateManager } from "../../services";
import { ValidationError } from "../../custom-errors";
import {
    AllSagesSelectedEvent,
    AllTeamsJoinedEvent,
    CancelSetupData,
    CancelSetupEvent,
    cancelSetupSchema,
    ChooseWarriorsData,
    ChooseWarriorsEvent,
    chooseWarriorsSchema,
    ClearTeamsEvent,
    CreateGameData,
    ElementalWarriorStarterCard,
    GameListing,
    GetSelectedSagesData,
    getSelectedSagesSchema,
    JoinGameData,
    joinGameSchema,
    JoinTeamData,
    joinTeamSchema,
    PlayerFinishedSetupData,
    PlayerFinishedSetupEvent,
    playerFinishedSetupSchema,
    PlayerJoinedData,
    PlayerJoinedEvent,
    PlayerRejoinedData,
    PlayerRejoinedEvent,
    ReadyStatusToggledData,
    ReadyStatusToggledEvent,
    RejoinGameData,
    rejoinGameSchema,
    SageSelectedData,
    SageSelectedEvent,
    SelectSageData,
    selectSageSchema,
    SwapWarriorsData,
    SwapWarriorsEvent,
    swapWarriorsSchema,
    TeamJoinedData,
    TeamJoinedEvent,
    ToggleReadyStatusData,
    toggleReadyStatusSchema,
} from "@shared-types";
import { UserSocketManager } from "../../services/UserSocketManager";
import { asyncHandler } from "src/middleware/asyncHandler";
import { getSocketId } from "../../lib/utilities/common";
import { Request, Response } from "express";
import {
    requireHostForAllPlayersSetup,
    requireHostForAllPlayersJoined,
    requireHostForAllSagesSelected,
    requireHostForAllTeamsJoined,
    requireHostForClearTeams,
} from "src/middleware/hostOnly";
import { validateRequestBody, validateRequestQuery } from "src/lib/utilities/routes";
import { ConGame } from "src/models";

const gameStateManager = GameStateManager.getInstance();
const userSocketManager = UserSocketManager.getInstance();

function createGameListing(game: ConGame): GameListing {
    return {
        id: game.id,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length,
    }
}

export default function createSetupRouter(gameEventEmitter: GameEventEmitter) {
    const router = express.Router();

    // POST /api/games/setup/create
    router.post(
        "/create",
        asyncHandler(async (req: Request, res: Response) => {
            const {
                userId,
                numPlayers,
                gameName,
                isPrivate,
                password,
            }: CreateGameData = req.body;
            const socketId = getSocketId(userId);

            const { game } = await gameStateManager.createGame(
                numPlayers,
                gameName,
                isPrivate,
                password || ""
            );
            gameStateManager.playerJoinGame(
                userId,
                socketId,
                game.id,
                true,
                password
            );
            const gameListing = createGameListing(game);
            userSocketManager.joinGameRoom(userId, game.id);
            res.json(gameListing);
        })
    );

    // POST /api/games/setup/join
    router.post(
        "/join",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId, gameId, password } = validateRequestBody<JoinGameData>(joinGameSchema, req);
            const socketId = getSocketId(userId);

            await gameStateManager.verifyAndProcessJoinGameEvent(gameId, async () => {
                await gameStateManager.playerJoinGame(
                    userId,
                    socketId,
                    gameId,
                    false,
                    password
                );
                
                userSocketManager.joinGameRoom(userId, gameId);
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    PlayerJoinedEvent,
                    { userId } as PlayerJoinedData
                );
            });

            const game = gameStateManager.getGame(gameId);
            const gameListing = createGameListing(game);
            res.json(gameListing);
        })
    );

    // POST /api/games/setup/rejoin
    router.post(
        "/rejoin",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId, gameId } = validateRequestBody<RejoinGameData>(
                rejoinGameSchema,
                req
            );
            const socketId = getSocketId(userId);

            await gameStateManager.playerRejoinedGame(gameId, userId, socketId);
            const game = gameStateManager.getGame(gameId);
            const gameListing = createGameListing(game);

            userSocketManager.joinGameRoom(userId, gameId);
            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                PlayerRejoinedEvent,
                { userId } as PlayerRejoinedData
            );
            res.json(gameListing);
        })
    );

    // POST /api/games/setup/:gameId/all-players-joined
    router.post(
        "/:gameId/all-players-joined",
        requireHostForAllPlayersJoined,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllPlayersJoinedEvent(gameId, async () => {
                await gameStateManager.allPlayersJoined(gameId);
            });

            res.status(200).json({ message: "All players joined successfully" });
        })
    );

    // POST /api/games/setup/:gameId/sage
    router.post(
        "/:gameId/sage",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId, sage } = validateRequestBody<SelectSageData>(
                selectSageSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);

            await gameStateManager.verifyAndProcessSelectSageEvent(gameId, async () => {
                await gameStateManager.setPlayerSage(gameId, socketId, sage);
                
                const availableSages = gameStateManager
                .getGame(gameId)
                .getAvailableSages();
                
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    SageSelectedEvent,
                    { userId, sage, availableSages } as SageSelectedData
                );
            });

            res.status(200).json({ message: "Sage selected successfully" });
        })
    );

    // GET /api/games/setup/:gameId/selected-sages
    router.get(
        "/:gameId/selected-sages",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestQuery<GetSelectedSagesData>(
                getSelectedSagesSchema,
                req
            );
            const gameId = req.params.gameId;
            const game = gameStateManager.getGame(gameId);
            const availableSages = game.getAvailableSages();
            const selectedSage = game.getPlayerByUserId(userId)?.sage;

            res.json({ availableSages, selectedSage });
        })
    );

    // POST /api/games/setup/:gameId/all-sages-selected
    router.post(
        "/:gameId/all-sages-selected",
        requireHostForAllSagesSelected,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllSagesSelectedEvent(gameId, async () => {
                await gameStateManager.allPlayersSelectedSage(gameId);
                gameEventEmitter.emitToAllPlayers(gameId, AllSagesSelectedEvent);
            });

            res.status(200).json({
                message: "All sages selected successfully",
            });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/join-team
    router.post(
        "/:gameId/join-team",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId, team } = validateRequestBody<JoinTeamData>(
                joinTeamSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);

            await gameStateManager.verifyAndProcessJoinTeamEvent(gameId, async () => {
                await gameStateManager.joinTeam(gameId, socketId, team);
    
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    TeamJoinedEvent,
                    { userId, team } as TeamJoinedData
                );
            });

            res.status(200).json({ message: "Team joined successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/clear-teams
    router.post(
        "/:gameId/clear-teams",
        requireHostForClearTeams,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessClearTeamsEvent(gameId, async () => {
                gameStateManager.getGame(gameId).clearTeams();
                gameEventEmitter.emitToAllPlayers(gameId, ClearTeamsEvent);
            });

            res.status(200).json({ message: "Teams cleared successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-teams-joined
    router.post(
        "/:gameId/all-teams-joined",
        requireHostForAllTeamsJoined,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllTeamsJoinedEvent(gameId, async () => {
                await gameStateManager.allTeamsJoined(gameId);
                gameEventEmitter.emitToAllPlayers(gameId, AllTeamsJoinedEvent);
            });

            res.status(200).json({ message: "All teams joined successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/toggle-ready
    router.post(
        "/:gameId/toggle-ready",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<ToggleReadyStatusData>(
                toggleReadyStatusSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);

            await gameStateManager.verifyAndProcessToggleReadyStatusEvent(gameId, async () => {
                const isReady = gameStateManager.toggleReadyStatus(
                    gameId,
                    socketId
                );
                
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    ReadyStatusToggledEvent,
                    { userId, isReady } as ReadyStatusToggledData
                );
            });

            res.status(200).json({
                message: "Ready status toggled successfully",
            });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/start
    router.post(
        "/:gameId/start",
        requireHostForAllPlayersSetup,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllPlayersReadyEvent(gameId, async () => {
                await gameStateManager.startGame(gameId);
                
                const game = gameStateManager.getGame(gameId);
                gameEventEmitter.emitPickWarriors(game.players);
            });

            res.status(200).json({ message: "Game started successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/choose-warriors
    router.post(
        "/:gameId/choose-warriors",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId, choices } = validateRequestBody<ChooseWarriorsData>(
                chooseWarriorsSchema,
                req
            );
            const parsedChoices: [
                ElementalWarriorStarterCard,
                ElementalWarriorStarterCard
            ] = [
                ElementalWarriorStarterCard.from(choices[0]),
                ElementalWarriorStarterCard.from(choices[1]),
            ];
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);
            
            await gameStateManager.verifyAndProcessChooseWarriorsEvent(gameId, async () => {
                const game = gameStateManager.getGame(gameId);
                const player = game.getPlayer(socketId);
                
                game.getPlayerTeam(player.userId).chooseWarriors(
                    player,
                    parsedChoices
                );

                gameEventEmitter.emitToTeammate(
                    game,
                    socketId,
                    ChooseWarriorsEvent,
                    { userId, choices } as ChooseWarriorsData
                );
            });

            res.status(200).json({ message: "Warriors chosen successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/swap-warriors
    router.post(
        "/:gameId/swap-warriors",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<SwapWarriorsData>(
                swapWarriorsSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);
            
            await gameStateManager.verifyAndProcessSwapWarriorsEvent(gameId, async () => {
                const game = gameStateManager.getGame(gameId);
                const player = game.getPlayer(socketId);
                game.getPlayerTeam(player.userId).swapWarriors(player);
            
                gameEventEmitter.emitToTeammate(game, socketId, SwapWarriorsEvent, {
                    userId,
                } as SwapWarriorsData);
            });

            res.status(200).json({ message: "Warriors swapped successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/finish-setup
    router.post(
        "/:gameId/finish-setup",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<PlayerFinishedSetupData>(
                playerFinishedSetupSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);
            
            await gameStateManager.verifyAndProcessFinishedSetupEvent(gameId, async () => {
                const game = gameStateManager.getGame(gameId);
                game.getPlayer(socketId).finishPlayerSetup();
                game.incrementPlayersFinishedSetup();
            
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    PlayerFinishedSetupEvent,
                    { userId } as PlayerFinishedSetupData
                );
            });

            res.status(200).json({ message: "Setup finished successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/cancel-setup
    router.post(
        "/:gameId/cancel-setup",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<CancelSetupData>(
                cancelSetupSchema,
                req
            );
            const gameId = req.params.gameId;
            const socketId = getSocketId(userId);
            
            await gameStateManager.verifyAndProcessCancelSetupEvent(gameId, async () => {
                const game = gameStateManager.getGame(gameId);
                game.getPlayer(socketId).cancelPlayerSetup();
                game.decrementPlayersFinishedSetup();
                
                gameEventEmitter.emitToOtherPlayersInRoom(
                    gameId,
                    socketId,
                    CancelSetupEvent,
                    { userId } as CancelSetupData
                );
            });

            res.status(200).json({ message: "Setup cancelled successfully" });
        })
    );

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-players-setup
    router.post(
        "/:gameId/all-players-setup",
        requireHostForAllPlayersSetup,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;
            
            await gameStateManager.verifyAndProcessAllPlayersSetupEvent(gameId, async () => {
                const game = gameStateManager.getGame(gameId);
                if (game.numPlayersFinishedSetup !== game.players.length) {
                    throw new ValidationError(
                        "All players have not finished setup",
                        "players"
                    );
                }

                const activeGame = gameStateManager.beginBattle(game);
                gameEventEmitter.emitStartTurn(
                    activeGame.getActiveTeamPlayers(),
                    activeGame.getWaitingTeamPlayers()
                );
            });
                
            res.status(200).json({ message: "All players setup successfully" });
        })
    );

    return router;
}
