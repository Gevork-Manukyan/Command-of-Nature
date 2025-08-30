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
            const { userId, gameId, password } =
                validateRequestBody<JoinGameData>(joinGameSchema, req);
            const socketId = getSocketId(userId);

            gameStateManager.verifyJoinGameEvent(gameId);
            await gameStateManager.playerJoinGame(
                userId,
                socketId,
                gameId,
                false,
                password
            );
            gameStateManager.processJoinGameEvent(gameId);
            const game = gameStateManager.getGame(gameId);
            const gameListing = createGameListing(game);

            userSocketManager.joinGameRoom(userId, gameId);
            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                PlayerJoinedEvent,
                { userId } as PlayerJoinedData
            );
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

            gameStateManager.verifySelectSageEvent(gameId);
            await gameStateManager.setPlayerSage(gameId, socketId, sage);
            gameStateManager.processSelectSageEvent(gameId);

            const availableSages = gameStateManager
                .getGame(gameId)
                .getAvailableSages();
            
            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                SageSelectedEvent,
                { userId, sage, availableSages } as SageSelectedData
            );
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

    // TODO: implement on client side
    // POST /api/games/setup/:gameId/all-sages-selected
    router.post(
        "/:gameId/all-sages-selected",
        requireHostForAllSagesSelected,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            gameStateManager.verifyAllSagesSelectedEvent(gameId);
            await gameStateManager.allPlayersSelectedSage(gameId);
            gameStateManager.processAllSagesSelectedEvent(gameId);

            gameEventEmitter.emitToAllPlayers(gameId, AllSagesSelectedEvent);
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

            gameStateManager.verifyJoinTeamEvent(gameId);
            await gameStateManager.joinTeam(gameId, socketId, team);
            gameStateManager.processJoinTeamEvent(gameId);

            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                TeamJoinedEvent,
                { userId, team } as TeamJoinedData
            );
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

            gameStateManager.verifyClearTeamsEvent(gameId);
            gameStateManager.getGame(gameId).clearTeams();
            gameStateManager.processClearTeamsEvent(gameId);

            gameEventEmitter.emitToAllPlayers(gameId, ClearTeamsEvent);
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

            gameStateManager.verifyAllTeamsJoinedEvent(gameId);
            await gameStateManager.allTeamsJoined(gameId);
            gameStateManager.processAllTeamsJoinedEvent(gameId);

            gameEventEmitter.emitToAllPlayers(gameId, AllTeamsJoinedEvent);
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

            gameStateManager.verifyToggleReadyStatusEvent(gameId);
            const isReady = gameStateManager.toggleReadyStatus(
                gameId,
                socketId
            );
            gameStateManager.processToggleReadyStatusEvent(gameId);

            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                ReadyStatusToggledEvent,
                { userId, isReady } as ReadyStatusToggledData
            );
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

            gameStateManager.verifyAllPlayersReadyEvent(gameId);
            await gameStateManager.startGame(gameId);
            gameStateManager.processAllPlayersReadyEvent(gameId);

            const game = gameStateManager.getGame(gameId);
            gameEventEmitter.emitPickWarriors(game.players);
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

            gameStateManager.verifyChooseWarriorsEvent(gameId);
            const game = gameStateManager.getGame(gameId);
            const player = game.getPlayer(socketId);
            game.getPlayerTeam(player.userId).chooseWarriors(
                player,
                parsedChoices
            );
            gameStateManager.processChooseWarriorsEvent(gameId);

            gameEventEmitter.emitToTeammate(
                game,
                socketId,
                ChooseWarriorsEvent,
                { userId, choices } as ChooseWarriorsData
            );
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

            gameStateManager.verifySwapWarriorsEvent(gameId);
            const game = gameStateManager.getGame(gameId);
            const player = game.getPlayer(socketId);
            game.getPlayerTeam(player.userId).swapWarriors(player);
            gameStateManager.processSwapWarriorsEvent(gameId);

            gameEventEmitter.emitToTeammate(game, socketId, SwapWarriorsEvent, {
                userId,
            } as SwapWarriorsData);
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

            gameStateManager.verifyFinishedSetupEvent(gameId);
            const game = gameStateManager.getGame(gameId);
            game.getPlayer(socketId).finishPlayerSetup();
            game.incrementPlayersFinishedSetup();
            gameStateManager.processFinishedSetupEvent(gameId);

            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                PlayerFinishedSetupEvent,
                { userId } as PlayerFinishedSetupData
            );
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

            gameStateManager.verifyCancelSetupEvent(gameId);
            const game = gameStateManager.getGame(gameId);
            game.getPlayer(socketId).cancelPlayerSetup();
            game.decrementPlayersFinishedSetup();
            gameStateManager.processCancelSetupEvent(gameId);

            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                CancelSetupEvent,
                { userId } as CancelSetupData
            );
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

            gameStateManager.verifyAllPlayersSetupEvent(gameId);
            const game = gameStateManager.getGame(gameId);
            if (game.numPlayersFinishedSetup !== game.players.length)
                throw new ValidationError(
                    "All players have not finished setup",
                    "players"
                );
            const activeGame = gameStateManager.beginBattle(game);
            gameStateManager.processAllPlayersSetupEvent(gameId);
            gameEventEmitter.emitStartTurn(
                activeGame.getActiveTeamPlayers(),
                activeGame.getWaitingTeamPlayers()
            );
            res.status(200).json({ message: "All players setup successfully" });
        })
    );

    return router;
}
