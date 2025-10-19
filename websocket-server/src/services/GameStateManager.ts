import { Sage } from "@shared-types";
import { ConGame, GameState, ActiveConGame, Player, Team } from "../models";
import { gameId, GameStateInfo } from "../types";
import { GameDatabaseService } from "./GameDatabaseService";
import { TransitionEvent } from "../../../shared-types/src/gamestate-types";
import {
    IncorrectPasswordError,
    ValidationError,
    GameFullError,
    GameAlreadyStartedError,
    GameNotFoundError,
    GameConflictError,
} from "../custom-errors";
import { updateUserActiveGames } from "../lib/utilities/db";

type EventProcessor = () => Promise<void>;

export class GameStateManager {
    private static instance: GameStateManager;
    private currentGames: {
        [key: gameId]: GameStateInfo;
    } = {};
    private gameDatabaseService = GameDatabaseService.getInstance();

    private constructor() {}

    static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }

    private async saveGame(game: ConGame): Promise<void> {
        const savedGame = await this.gameDatabaseService.saveGame(game);
        this.setGame(game.id, savedGame);
    }

    /**
     * Creates a new game/state and saves it to the database
     * @param numPlayersTotal - The number of players in the game
     * @returns The newly created/saved game and game state
     */
    async createGame(
        numPlayersTotal: ConGame["numPlayersTotal"],
        gameName: ConGame["gameName"],
        isPrivate: ConGame["isPrivate"],
        password: ConGame["password"]
    ): Promise<GameStateInfo> {
        const { game, state } = await this.gameDatabaseService.saveNewGame(
            numPlayersTotal,
            gameName,
            isPrivate,
            password
        );
        this.addGameAndState(game.id, game, state);
        return { game, state };
    }

    /**
     * Adds a player to a game and saves the game state to the database
     * @param userId - The id of the user to add
     * @param socketId - The id of the socket to add
     * @param gameId - The id of the game to add the player to
     * @param isHost - Whether the player is the host
     */
    async playerJoinGame(
        userId: string,
        socketId: string,
        gameId: gameId,
        isHost: boolean,
        password?: string
    ): Promise<void> {
        const game = this.getGame(gameId);
        if (game.isPrivate && password !== game.password) {
            throw new IncorrectPasswordError();
        }

        // Check if player already exists with same socket ID
        const existingPlayer = game.players.find(
            (p) => p.socketId === socketId
        );

        if (existingPlayer) {
            // If it's the same user, just update their socket ID
            if (existingPlayer.userId === userId) {
                existingPlayer.updateSocketId(socketId);
                await this.saveGame(game);
                return;
            }
            throw new ValidationError(
                "A player with this socket ID already exists in the game",
                "socketId"
            );
        }

        if (game.players.some((p) => p.userId === userId)) {
            throw new ValidationError("You are already in this game", "userId");
        }

        if (game.players.length >= game.numPlayersTotal) {
            throw new GameFullError();
        }

        if (game.isStarted) {
            throw new GameAlreadyStartedError();
        }

        await updateUserActiveGames(userId, gameId);

        const player = new Player(userId, socketId, isHost);
        game.addPlayer(player);
        await this.saveGame(game);
    }

    /**
     * Adds a player to a game and saves the game state to the database
     * @param gameId - The id of the game to add the player to
     * @param userId - The id of the user to add
     * @param socketId - The id of the socket to add
     */
    async playerRejoinGame(
        gameId: gameId,
        userId: string,
        socketId: string
    ): Promise<void> {
        const game = this.getGame(gameId);
        for (const player of game.players) {
            if (player.userId === userId) {
                player.updateSocketId(socketId);
                await this.saveGame(game);
                return;
            }
        }
        throw new ValidationError("User not found in game", "userId");
    }

    /**
     * Removes a player from a game and saves the game state to the database
     * @param gameId - The id of the game to remove the player from
     * @param socketId - The id of the socket to remove
     */
    async removePlayerFromGame(
        gameId: gameId,
        socketId: string
    ): Promise<void> {
        const game = this.getGame(gameId);
        game.removePlayer(socketId);

        // If there are no players left, delete the game and its state
        if (game.players.length === 0) {
            await this.gameDatabaseService.deleteGameAndState(gameId);
            this.deleteGame(gameId);
            return;
        }

        await this.saveGame(game);
    }

    /**
     * Validates that all players have joined
     * @param gameId - The id of the game to validate
     */
    async allPlayersJoined(gameId: gameId): Promise<void> {
        const game = this.getGame(gameId);
        const { players, numPlayersTotal } = game;

        if (players.length !== numPlayersTotal) {
            throw new ValidationError(
                `Missing ${numPlayersTotal - players.length} players`,
                "players"
            );
        }

        await this.saveGame(game);
    }

    /**
     * Sets a player's sage
     * @param gameId - The id of the game to set the player's sage
     * @param socketId - The id of the socket to set the player's sage
     * @param sage - The sage to set
     */
    async setPlayerSage(gameId: gameId, socketId: string, sage: Sage) {
        const game = this.getGame(gameId);
        game.setPlayerSage(socketId, sage);
        await this.saveGame(game);
    }

    /**
     * Validates that all players have selected a sage
     * @param gameId - The id of the game to validate
     */
    async allPlayersSelectedSage(gameId: gameId): Promise<void> {
        const game = this.getGame(gameId);
        const { players, numPlayersTotal } = game;

        if (players.length !== numPlayersTotal) {
            throw new ValidationError(
                `Missing ${numPlayersTotal - players.length} players`,
                "players"
            );
        }

        if (players.some((player) => !player.sage)) {
            throw new ValidationError("All players must select a sage", "sage");
        }

        await this.saveGame(game);
    }

    /**
     * Joins a player to a team
     * @param gameId - The id of the game to join the player to
     * @param socketId - The id of the socket to join the player to
     * @param team - The team to join
     */
    async joinTeam(gameId: gameId, socketId: string, team: Team["teamNumber"]) {
        const game = this.getGame(gameId);
        game.joinTeam(socketId, team);
        await this.saveGame(game);
        return game;
    }

    /**
     * Validates that all teams have joined
     * @param gameId - The id of the game to validate
     */
    async allTeamsJoined(gameId: gameId): Promise<void> {
        const game = this.getGame(gameId);
        game.validateAllTeamsJoined();
        await this.saveGame(game);
    }

    /**
     * Toggles a player's ready status
     * @param gameId - The ID of the game
     * @param socketId - The socket ID of the player
     * @returns The new ready status
     */
    toggleReadyStatus(gameId: gameId, socketId: string): boolean {
        const game = this.getGame(gameId);
        const currPlayer = game.getPlayer(socketId);

        if (!currPlayer.sage) {
            throw new ValidationError(
                "Cannot toggle ready. The sage has not been set.",
                "sage"
            );
        }

        currPlayer.toggleReady();

        if (currPlayer.isReady) {
            game.incrementPlayersReady();
        } else {
            game.decrementPlayersReady();
        }

        return currPlayer.isReady;
    }

    async startGame(gameId: gameId): Promise<void> {
        const game = this.getGame(gameId);
        game.initGame();
        await this.saveGame(game);
    }

    /**
     * Loads all existing games and their states from the database into the GameStateManager
     */
    async loadExistingGames(): Promise<void> {
        try {
            // Find all games
            const games = await this.gameDatabaseService.findAllGames();

            // For each game, load its state and add it to the GameStateManager
            for (const game of games) {
                try {
                    const gameState =
                        await this.gameDatabaseService.findGameStateByGameId(
                            game.id
                        );
                    this.addGameAndState(game.id, game, gameState);
                    console.debug(`Loaded game ${game.id} from database`);
                } catch (error) {
                    console.error(`Failed to load game ${game.id}:`, error);
                }
            }
        } catch (error) {
            console.error("Failed to load existing games:", error);
        }
    }

    /**
     * Adds a game and game state to the current games
     * @param gameId - The id of the game to add
     * @param game - The game to add
     * @param gameState - The game state to add
     */
    addGameAndState(gameId: gameId, game: ConGame, gameState: GameState): void {
        this.currentGames[gameId] = {
            game: game,
            state: gameState,
        };
    }

    /**
     * Gets a game from the current games
     * @param gameId - The id of the game to get
     * @returns The game
     */
    getGame(gameId: gameId): ConGame {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameNotFoundError(gameId);
        return gameState.game;
    }

    /**
     * Sets a game in the current games
     * @param gameId - The id of the game to set
     * @param game - The game to set
     */
    setGame(gameId: gameId, game: ConGame): void {
        this.currentGames[gameId].game = game;
    }

    /**
     * Gets a game state from the current games
     * @param gameId - The id of the game to get
     * @returns The game state
     */
    getGameState(gameId: gameId): GameState {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
        if (!gameState.state)
            throw new GameConflictError(gameId, "Game state not loaded");
        return gameState.state;
    }

    /**
     * Sets a game state in the current games
     * @param gameId - The id of the game to set
     * @param gameState - The game state to set
     */
    setGameState(gameId: gameId, gameState: GameState): void {
        this.currentGames[gameId].state = gameState;
    }

    /**
     * Gets an active game from the current games
     * @param gameId - The id of the game to get
     * @returns The active game
     */
    getActiveGame(gameId: gameId): ActiveConGame {
        const game = this.getGame(gameId);
        if (!this.isActiveGame(game)) {
            throw new Error("Game has not finished setup yet.");
        }
        return game;
    }

    /**
     * Checks if a game is an active game
     * @param game - The game to check
     * @returns True if the game is an active game, false otherwise
     */
    private isActiveGame(game: ConGame): game is ActiveConGame {
        return game.getHasFinishedSetup();
    }

    /**
     * Gets the current games
     * @returns The current games
     */
    getCurrentGames(): { [key: gameId]: GameStateInfo } {
        return this.currentGames;
    }

    /**
     * Deletes a game from the current games
     * @param gameId - The id of the game to delete
     */
    deleteGame(gameId: gameId): void {
        if (this.currentGames.hasOwnProperty(gameId)) {
            delete this.currentGames[gameId];
        }
    }

    /**
     * Begins a battle
     * @param game - The game to begin
     * @returns The active game
     */
    beginBattle(game: ConGame): ActiveConGame {
        const activeGame = game.finishedSetup();
        this.setGame(game.id, activeGame);
        return activeGame;
    }

    /**
     * Resets the game state manager
     */
    resetGameStateManager(): void {
        this.currentGames = {};
    }

    /* -------- PROCESSING GAME STATE -------- */

    /**
     * Helper method to process an event and save its state
     * @param gameId - The ID of the game
     * @param event - The event to process
     */
    private async processEventAndSaveState(
        gameId: gameId,
        event: TransitionEvent
    ): Promise<void> {
        const savedGameState = await this.getGameState(gameId).processEvent(
            event
        );
        await this.gameDatabaseService.saveGameState(gameId, savedGameState);
        this.setGameState(gameId, savedGameState);
    }

    private async verifyAndProcessEvent(
        gameId: gameId,
        event: TransitionEvent,
        fn: EventProcessor
    ): Promise<void> {
        this.getGameState(gameId).verifyEvent(event);
        await fn();
        await this.processEventAndSaveState(gameId, event);
    }

    // ###### Player Joined ######
    async verifyAndProcessJoinGameEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.PLAYER_JOINED,
            fn
        );
    }

    // ###### All Players Joined ######
    async verifyAndProcessAllPlayersJoinedEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.ALL_PLAYERS_JOINED,
            fn
        );
    }

    // ###### Player Selected Sage ######
    async verifyAndProcessSelectSageEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.PLAYER_SELECTED_SAGE,
            fn
        );
    }

    // ###### All Sages Selected ######
    async verifyAndProcessAllSagesSelectedEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.ALL_SAGES_SELECTED,
            fn
        );
    }

    // ###### Player Joined Team ######
    async verifyAndProcessJoinTeamEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.PLAYER_JOINED_TEAM,
            fn
        );
    }

    // ###### Clear Teams ######
    async verifyAndProcessClearTeamsEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.CLEAR_TEAMS,
            fn
        );
    }

    // ###### All Teams Joined ######
    async verifyAndProcessAllTeamsJoinedEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.ALL_TEAMS_JOINED,
            fn
        );
    }

    // ###### Toggle Ready Status ######
    async verifyAndProcessToggleReadyStatusEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.TOGGLE_READY_STATUS,
            fn
        );
    }

    // ###### All Players Ready ######
    async verifyAndProcessAllPlayersReadyEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.ALL_PLAYERS_READY,
            fn
        );
    }

    // ###### Choose Warriors ######
    async verifyAndProcessChooseWarriorsEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.CHOOSE_WARRIORS,
            fn
        );
    }

    // ###### Swap Warriors ######
    async verifyAndProcessSwapWarriorsEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.SWAP_WARRIORS,
            fn
        );
    }

    // ###### Cancel Setup ######
    async verifyAndProcessCancelSetupEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.CANCEL_SETUP,
            fn
        );
    }

    // ###### Player Finished Setup ######
    async verifyAndProcessFinishedSetupEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.PLAYER_FINISHED_SETUP,
            fn
        );
    }

    // ###### All Players Setup Complete ######
    async verifyAndProcessAllPlayersSetupEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE,
            fn
        );
    }

    // ###### Activate Day Break ######
    async verifyAndProcessActivateDayBreakEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.ACTIVATE_DAY_BREAK_CARD,
            fn
        );
    }

    // ###### Next Phase ######
    async verifyAndProcessNextPhaseEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.NEXT_PHASE,
            fn
        );
    }

    // ###### Draw Card ######
    async verifyAndProcessDrawCardEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(gameId, TransitionEvent.DRAW_CARD, fn);
    }

    // ###### Swap Cards ######
    async verifyAndProcessSwapCardsEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.SWAP_CARDS,
            fn
        );
    }

    // ###### Summon Card ######
    async verifyAndProcessSummonCardEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.SUMMON_CARD,
            fn
        );
    }

    // ###### Attack ######
    async verifyAndProcessAttackEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(gameId, TransitionEvent.ATTACK, fn);
    }

    // ###### Utility ######
    async verifyAndProcessUtilityEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(gameId, TransitionEvent.UTILITY, fn);
    }

    // ###### Sage Skill ######
    async verifyAndProcessSageSkillEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.SAGE_SKILL,
            fn
        );
    }

    // ###### Win Game ######
    async verifyAndProcessWinGameEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(gameId, TransitionEvent.WIN_GAME, fn);
    }

    // ###### Buy Card ######
    async verifyAndProcessBuyCardEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(gameId, TransitionEvent.BUY_CARD, fn);
    }

    // ###### Sell Card ######
    async verifyAndProcessSellCardEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(gameId, TransitionEvent.SELL_CARD, fn);
    }

    // ###### Refresh Shop ######
    async verifyAndProcessRefreshShopEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.REFRESH_SHOP,
            fn
        );
    }

    // ###### Done Discarding Cards ######
    async verifyAndProcessDoneDiscardingCardsEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.DONE_DISCARDING_CARDS,
            fn
        );
    }

    // ###### Done Drawing New Hand ######
    async verifyAndProcessDoneDrawingNewHandEvent(
        gameId: gameId,
        fn: EventProcessor
    ): Promise<void> {
        await this.verifyAndProcessEvent(
            gameId,
            TransitionEvent.DONE_DRAWING_NEW_HAND,
            fn
        );
    }

    // ------ Testing Methods ------

    // ###### Get All Games ######
    getAllGames(): { [key: gameId]: GameStateInfo } {
        return this.currentGames;
    }

    // ###### Clear Games ######
    clearGames(): void {
        this.currentGames = {};
    }
}
