import express from "express";
import { GameEventEmitter } from "../../services";
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
    AllPlayersJoinedEvent,
    State,
    NextStateData,
    TeamsClearedData,
    StartGameEvent,
    ALL_CARDS,
    GetUserWarriorSelectionDataData,
    getUserWarriorSelectionDataSchema,
    WarriorSelectionState,
    BeginBattleEvent,
    WaitingTurnEvent,
    StartTurnEvent,
} from "@shared-types";
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
import {
    validateRequestBody,
    validateRequestQuery,
} from "src/lib/utilities/routes";
import { ConGame } from "src/models";
import {
    gameStateManager,
    getUpdatedUsers,
    userSocketManager,
} from "src/lib/utilities/game-routes";

function createGameListing(game: ConGame): GameListing {
    return {
        id: game.id,
        gameName: game.gameName,
        isPrivate: game.isPrivate,
        numPlayersTotal: game.numPlayersTotal,
        numCurrentPlayers: game.players.length,
    };
}

function getTeams(game: ConGame): { [key in 1 | 2]: string[] } {
    return {
        1: game.team1.userIds,
        2: game.team2.userIds,
    };
}


export default function createSetupRouter(gameEventEmitter: GameEventEmitter) {
    const router = express.Router();

    // GET /api/games/setup/:gameId/user-setup-data
    router.get(
        "/:gameId/user-setup-data",
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;
            const response = await getUpdatedUsers(gameId);
            res.json(response);
        })
    );

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

            await gameStateManager.verifyAndProcessJoinGameEvent(
                gameId,
                async () => {
                    await gameStateManager.playerJoinGame(
                        userId,
                        socketId,
                        gameId,
                        false,
                        password
                    );

                    userSocketManager.joinGameRoom(userId, gameId);

                    const data: PlayerJoinedData = await getUpdatedUsers(
                        gameId
                    );
                    gameEventEmitter.emitToOtherPlayersInRoom(
                        gameId,
                        socketId,
                        PlayerJoinedEvent,
                        data
                    );
                }
            );

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
            const data: PlayerRejoinedData = await getUpdatedUsers(gameId);
            gameEventEmitter.emitToOtherPlayersInRoom(
                gameId,
                socketId,
                PlayerRejoinedEvent,
                data
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

            await gameStateManager.verifyAndProcessAllPlayersJoinedEvent(
                gameId,
                async () => {
                    await gameStateManager.allPlayersJoined(gameId);
                    gameEventEmitter.emitToAllPlayers(
                        gameId,
                        AllPlayersJoinedEvent,
                        { nextState: State.SAGE_SELECTION } as NextStateData
                    );
                }
            );

            res.status(200).json({
                message: "All players joined successfully",
            });
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

            await gameStateManager.verifyAndProcessSelectSageEvent(
                gameId,
                async () => {
                    await gameStateManager.setPlayerSage(
                        gameId,
                        socketId,
                        sage
                    );

                    const availableSages = gameStateManager
                        .getGame(gameId)
                        .getAvailableSages();

                    gameEventEmitter.emitToOtherPlayersInRoom(
                        gameId,
                        socketId,
                        SageSelectedEvent,
                        { userId, sage, availableSages } as SageSelectedData
                    );
                }
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

    // POST /api/games/setup/:gameId/all-sages-selected
    router.post(
        "/:gameId/all-sages-selected",
        requireHostForAllSagesSelected,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllSagesSelectedEvent(
                gameId,
                async () => {
                    await gameStateManager.allPlayersSelectedSage(gameId);
                    gameEventEmitter.emitToAllPlayers(
                        gameId,
                        AllSagesSelectedEvent,
                        { nextState: State.JOINING_TEAMS } as NextStateData
                    );
                }
            );

            res.status(200).json({
                message: "All sages selected successfully",
            });
        })
    );

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

            await gameStateManager.verifyAndProcessJoinTeamEvent(
                gameId,
                async () => {
                    const updatedGame = await gameStateManager.joinTeam(
                        gameId,
                        socketId,
                        team
                    );
                    const updatedTeams = getTeams(updatedGame);
                    gameEventEmitter.emitToAllPlayers(gameId, TeamJoinedEvent, {
                        updatedTeams,
                    } as TeamJoinedData);
                }
            );

            res.status(200).json({ message: "Team joined successfully" });
        })
    );

    // POST /api/games/setup/:gameId/clear-teams
    router.post(
        "/:gameId/clear-teams",
        requireHostForClearTeams,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessClearTeamsEvent(
                gameId,
                async () => {
                    gameStateManager.getGame(gameId).clearTeams();
                    gameEventEmitter.emitToAllPlayers(gameId, ClearTeamsEvent, {
                        updatedTeams: { 1: [], 2: [] },
                    } as TeamsClearedData);
                }
            );

            res.status(200).json({ message: "Teams cleared successfully" });
        })
    );

    // POST /api/games/setup/:gameId/all-teams-joined
    router.post(
        "/:gameId/all-teams-joined",
        requireHostForAllTeamsJoined,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllTeamsJoinedEvent(
                gameId,
                async () => {
                    await gameStateManager.allTeamsJoined(gameId);
                    gameEventEmitter.emitToAllPlayers(
                        gameId,
                        AllTeamsJoinedEvent,
                        { nextState: State.READY_UP } as NextStateData
                    );
                }
            );

            res.status(200).json({ message: "All teams joined successfully" });
        })
    );

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

            await gameStateManager.verifyAndProcessToggleReadyStatusEvent(
                gameId,
                async () => {
                    const isReady = gameStateManager.toggleReadyStatus(
                        gameId,
                        socketId
                    );

                    gameEventEmitter.emitToAllPlayers(
                        gameId,
                        ReadyStatusToggledEvent,
                        { userId, isReady } as ReadyStatusToggledData
                    );
                }
            );

            res.status(200).json({
                message: "Ready status toggled successfully",
            });
        })
    );

    // POST /api/games/setup/:gameId/start
    router.post(
        "/:gameId/start",
        requireHostForAllPlayersSetup,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllPlayersReadyEvent(
                gameId,
                async () => {
                    await gameStateManager.startGame(gameId);
                    gameEventEmitter.emitToAllPlayers(gameId, StartGameEvent, {
                        nextState: State.WARRIOR_SELECTION,
                    } as NextStateData);
                }
            );

            res.status(200).json({ message: "Game started successfully" });
        })
    );

    // GET /api/games/setup/:gameId/is-started
    router.get(
        "/:gameId/is-started",
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;
            try {
                const game = gameStateManager.getGame(gameId);
                res.status(200).json({ isStarted: game.isStarted });
            } catch (e) {
                res.status(404).json({ isStarted: false });
            }
        })
    );

    // GET /api/games/setup/:gameId/user-warrior-selection-data
    router.get(
        "/:gameId/user-warrior-selection-data",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestQuery<GetUserWarriorSelectionDataData>(
                getUserWarriorSelectionDataSchema,
                req
            );

            const gameId = req.params.gameId;
            const game = gameStateManager.getGame(gameId);
            const player = game.getPlayerByUserId(userId);
            const deckWarriors = player?.decklist?.warriors;
            const hasChosenWarriors = player?.hasChosenWarriors;
            const isSetup = player?.isSetup;

            if (!deckWarriors) {
                return res.status(404).json({ deckWarriors: [] });
            }

            let warriorSelectionState: WarriorSelectionState;
            if (!hasChosenWarriors) {
                warriorSelectionState = "selecting";
            } else if (hasChosenWarriors && !isSetup) {
                warriorSelectionState = "swapping";
            } else if (hasChosenWarriors && isSetup) {
                warriorSelectionState = "finished";
            } else {
                return res.status(400).json({ error: "Invalid warrior selection state" });
            }

            // Get selected warriors based on team size
            let selectedWarriors = null;
            
            // If player has chosen warriors, get the selected warriors and positions
            if (hasChosenWarriors) {
                const team = game.getPlayerTeamByUserId(userId); 
                if (!team) {
                    throw new ValidationError("Team not found", "team");
                }
                const battlefield = team.getBattlefield();

                if (team.getTeamSize() === 1) {
                    // 1-player team: positions 4 and 6
                    const warrior1 = battlefield.getCard(4);
                    const warrior2 = battlefield.getCard(6);
                    selectedWarriors = [warrior1, warrior2].filter(card => card !== null);
                } else {
                    // 2-player team: check which side the player's element matches
                    const leftSage = battlefield.getCard(8);
                    const rightSage = battlefield.getCard(11);
                    
                    if (player.getElement() === leftSage?.element) {
                        const warrior1 = battlefield.getCard(7);
                        const warrior2 = battlefield.getCard(9);
                        selectedWarriors = [warrior1, warrior2].filter(card => card !== null);
                    } else if (player.getElement() === rightSage?.element) {
                        const warrior1 = battlefield.getCard(10);
                        const warrior2 = battlefield.getCard(12);
                        selectedWarriors = [warrior1, warrior2].filter(card => card !== null);
                    }
                }
            }

            const isAllPlayersSetup = game.checkAllPlayersFinishedSetup();
        
            res.status(200).json({ 
                deckWarriors,
                warriorSelectionState,
                selectedWarriors,
                isAllPlayersSetup,
            });
        })
    );

    // POST /api/games/setup/:gameId/choose-warriors
    router.post(
        "/:gameId/choose-warriors",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId, choices } = validateRequestBody<ChooseWarriorsData>(
                chooseWarriorsSchema,
                req
            );

            const cardFactory1 = ALL_CARDS[choices[0] as keyof typeof ALL_CARDS];
            const cardFactory2 = ALL_CARDS[choices[1] as keyof typeof ALL_CARDS];

            if (!cardFactory1 || !cardFactory2) {
                throw new ValidationError(
                    "Invalid card name provided",
                    "choices"
                );
            }

            const parsedChoices: [
                ElementalWarriorStarterCard,
                ElementalWarriorStarterCard
            ] = [
                cardFactory1() as ElementalWarriorStarterCard,
                cardFactory2() as ElementalWarriorStarterCard,
            ];
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessChooseWarriorsEvent(
                gameId,
                async () => {
                    const game = gameStateManager.getGame(gameId);

                    const player = game.getPlayerByUserId(userId);
                    if (!player) {
                        throw new ValidationError("Player not found", "player");
                    }

                    const team = game.getPlayerTeamByUserId(player.userId);
                    if (!team) {
                        throw new ValidationError(
                            "Player not on team",
                            "player"
                        );
                    }

                    team.chooseWarriors(player, parsedChoices);

                    gameEventEmitter.emitToTeammate(
                        game,
                        userId,
                        ChooseWarriorsEvent,
                        { userId, choices } as ChooseWarriorsData
                    );
                }
            );

            res.status(200).json({
                message: "Warriors chosen successfully" 
            });
        })
    );

    // POST /api/games/setup/:gameId/swap-warriors
    router.post(
        "/:gameId/swap-warriors",
        asyncHandler(async (req: Request, res: Response) => {
            const { userId } = validateRequestBody<SwapWarriorsData>(
                swapWarriorsSchema,
                req
            );
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessSwapWarriorsEvent(
                gameId,
                async () => {
                    const game = gameStateManager.getGame(gameId);
                    const player = game.getPlayerByUserId(userId);
                    if (!player) {
                        throw new ValidationError("Player not found", "player");
                    }
                    const team = game.getPlayerTeamByUserId(player.userId);
                    if (!team) {
                        throw new ValidationError(
                            "Player not on team",
                            "player"
                        );
                    }

                    team.swapWarriors(player);

                    gameEventEmitter.emitToTeammate(
                        game,
                        userId,
                        SwapWarriorsEvent,
                        {
                            userId,
                        } as SwapWarriorsData
                    );
                }
            );

            res.status(200).json({ message: "Warriors swapped successfully" });
        })
    );

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

            await gameStateManager.verifyAndProcessFinishedSetupEvent(
                gameId,
                async () => {
                    const game = gameStateManager.getGame(gameId);
                    const player = game.getPlayerByUserId(userId);
                    if (!player) {
                        throw new ValidationError("Player not found", "player");
                    }
                    player.finishPlayerSetup();
                    game.incrementPlayersFinishedSetup();

                    gameEventEmitter.emitToOtherPlayersInRoom(
                        gameId,
                        socketId,
                        PlayerFinishedSetupEvent,
                        { userId } as PlayerFinishedSetupData
                    );

                    gameEventEmitter.checkAndEmitAllPlayersSetupStatus(game);
                }
            );

            res.status(200).json({ message: "Setup finished successfully" });
        })
    );

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

            await gameStateManager.verifyAndProcessCancelSetupEvent(
                gameId,
                async () => {
                    const game = gameStateManager.getGame(gameId);
                    const player = game.getPlayerByUserId(userId);
                    if (!player) {
                        throw new ValidationError("Player not found", "player");
                    }
                    player.cancelPlayerSetup();
                    
                    // Reset warrior choices for the player
                    const team = game.getPlayerTeamByUserId(player.userId);
                    if (team) {
                        team.resetWarriorChoices(player);
                    }
                    
                    game.decrementPlayersFinishedSetup();

                    gameEventEmitter.emitToOtherPlayersInRoom(
                        gameId,
                        socketId,
                        CancelSetupEvent,
                        { userId } as CancelSetupData
                    );

                    gameEventEmitter.checkAndEmitAllPlayersSetupStatus(game);
                }
            );

            res.status(200).json({ message: "Setup cancelled successfully" });
        })
    );

    // POST /api/games/setup/:gameId/begin-battle
    router.post(
        "/:gameId/begin-battle",
        requireHostForAllPlayersSetup,
        asyncHandler(async (req: Request, res: Response) => {
            const gameId = req.params.gameId;

            await gameStateManager.verifyAndProcessAllPlayersSetupEvent(
                gameId,
                async () => {
                    const game = gameStateManager.getGame(gameId);
                    if (game.numPlayersFinishedSetup !== game.players.length) {
                        throw new ValidationError(
                            "All players have not finished setup",
                            "players"
                        );
                    }

                    const activeGame = gameStateManager.beginBattle(game);

                    gameEventEmitter.emitToAllPlayers(gameId, BeginBattleEvent, { nextState: State.PHASE1 } as NextStateData);
                    gameEventEmitter.emitToPlayers(activeGame.getActiveTeamPlayers(), StartTurnEvent);
                    gameEventEmitter.emitToPlayers(activeGame.getWaitingTeamPlayers(), WaitingTurnEvent);
                }
            );

            res.status(200).json({ message: "Battle begun successfully" });
        })
    );

    return router;
}
