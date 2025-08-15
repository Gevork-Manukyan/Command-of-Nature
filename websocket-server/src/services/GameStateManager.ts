import { Sage } from "@shared-types";
import { ConGame, GameState, ActiveConGame, Player, Team } from "../models";
import { gameId, GameStateInfo } from "../types";
import { ValidationError } from "./CustomError/BaseError";
import { GameConflictError } from "./CustomError/GameError";
import { gameDatabaseService } from "./GameDatabaseService";
import { TransitionEvent } from "../models/GameState/gamestate-types";

export class GameStateManager {
    private static instance: GameStateManager;
    private currentGames: {
        [key: gameId]: GameStateInfo;
    } = {};

    private constructor() {}

    static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }

    private async saveGame(game: ConGame): Promise<void> {
        const savedGame = await gameDatabaseService.saveGame(game);
        this.setGame(game.id, savedGame);
    }

    /**
     * Creates a new game/state and saves it to the database
     * @param numPlayersTotal - The number of players in the game
     * @returns The newly created/saved game and game state
     */
    async createGame(numPlayersTotal: ConGame['numPlayersTotal'], gameName: ConGame['gameName'], isPrivate: ConGame['isPrivate'], password: ConGame['password']): Promise<GameStateInfo> {
        const { game, state } = await gameDatabaseService.saveNewGame(numPlayersTotal, gameName, isPrivate, password);
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
    async playerJoinGame(userId: string, socketId: string, gameId: gameId, isHost: boolean, password?: string): Promise<void> {
        const game = this.getGame(gameId);
        if (game.isPrivate && password !== game.password) {
            throw new ValidationError("Incorrect password", "password");
        }
        
        // Check if player already exists with same socket ID
        const existingPlayer = game.players.find(p => p.socketId === socketId);
        if (existingPlayer) {
            // If it's the same user, just update their socket ID
            if (existingPlayer.userId === userId) {
                existingPlayer.updateSocketId(socketId);
                await this.saveGame(game);
                return;
            }
            throw new ValidationError("A player with this socket ID already exists in the game", "socketId");
        }
        
        if (game.players.some(p => p.userId === userId)) {
            throw new ValidationError("You are already in this game", "userId");
        }
        
        if (game.players.length >= game.numPlayersTotal) {
            throw new ValidationError("Cannot add more players", "players");
        }
        
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
    async playerRejoinedGame(gameId: gameId, userId: string, socketId: string): Promise<void> {
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
    async removePlayerFromGame(gameId: gameId, socketId: string): Promise<void> {
        const game = this.getGame(gameId);
        game.removePlayer(socketId);

        // If there are no players left, delete the game and its state
        if (game.players.length === 0) {
            await gameDatabaseService.deleteGameAndState(gameId);
            this.deleteGame(gameId);
            return;
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
        game.validateAllPlayersSeclectedSage();
        await this.saveGame(game);
    }

    /**
     * Joins a player to a team
     * @param gameId - The id of the game to join the player to
     * @param socketId - The id of the socket to join the player to
     * @param team - The team to join
     */
    async joinTeam(gameId: gameId, socketId: string, team: Team['teamNumber']) {
        const game = this.getGame(gameId);
        game.joinTeam(socketId, team);
        await this.saveGame(game);
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
            throw new ValidationError("Cannot toggle ready. The sage has not been set.", "sage");
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
            const games = await gameDatabaseService.findAllGames();
            
            // For each game, load its state and add it to the GameStateManager
            for (const game of games) {
                try {
                    const gameState = await gameDatabaseService.findGameStateByGameId(game.id);
                    this.addGameAndState(game.id, game, gameState);
                    console.debug(`Loaded game ${game.id} from database`);
                } catch (error) {
                    console.error(`Failed to load game ${game.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Failed to load existing games:', error);
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
            state: gameState
        };
    }

    /**
     * Gets a game from the current games
     * @param gameId - The id of the game to get
     * @returns The game
     */
    getGame(gameId: gameId): ConGame {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
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
        if (!gameState.state) throw new GameConflictError(gameId, 'Game state not loaded');
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
    private async processEventAndSaveState(gameId: gameId, event: TransitionEvent): Promise<void> {
        const savedGameState = await this.getGameState(gameId).processEvent(event);
        await gameDatabaseService.saveGameState(gameId, savedGameState);
        this.setGameState(gameId, savedGameState);
    }

    // ###### Player Joined ######
    verifyJoinGameEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_JOINED);
    }

    async processJoinGameEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.PLAYER_JOINED);
    }

    // ###### Player Selected Sage ######
    verifySelectSageEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_SELECTED_SAGE);
    }

    async processSelectSageEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.PLAYER_SELECTED_SAGE);
    }

    // ###### All Sages Selected ######
    verifyAllSagesSelectedEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_SAGES_SELECTED);
    }

    async processAllSagesSelectedEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.ALL_SAGES_SELECTED);
    }

    // ###### Player Joined Team ######
    verifyJoinTeamEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_JOINED_TEAM);
    }

    async processJoinTeamEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.PLAYER_JOINED_TEAM);
    }

    // ###### Clear Teams ######
    verifyClearTeamsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.CLEAR_TEAMS);
    }

    async processClearTeamsEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.CLEAR_TEAMS);
    }

    // ###### All Teams Joined ######
    verifyAllTeamsJoinedEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_TEAMS_JOINED);
    }

    async processAllTeamsJoinedEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.ALL_TEAMS_JOINED);
    }

    // ###### Toggle Ready Status ######
    verifyToggleReadyStatusEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.TOGGLE_READY_STATUS);
    }

    async processToggleReadyStatusEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.TOGGLE_READY_STATUS);
    }

    // ###### All Players Ready ######
    verifyAllPlayersReadyEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_PLAYERS_READY);
    }

    async processAllPlayersReadyEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.ALL_PLAYERS_READY);
    }

    // ###### Choose Warriors ######
    verifyChooseWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.CHOOSE_WARRIORS);
    }

    async processChooseWarriorsEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.CHOOSE_WARRIORS);
    }

    // ###### Swap Warriors ######
    verifySwapWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.SWAP_WARRIORS);
    }

    async processSwapWarriorsEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.SWAP_WARRIORS);
    }

    // ###### Finished Setup ######
    verifyFinishedSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_FINISHED_SETUP);
    }

    async processFinishedSetupEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.PLAYER_FINISHED_SETUP);
    }

    // ###### Cancel Setup ######
    verifyCancelSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.CANCEL_SETUP);
    }

    async processCancelSetupEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.CANCEL_SETUP);
    }

    // ###### All Players Setup ######
    verifyAllPlayersSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE);
    }

    async processAllPlayersSetupEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE);
    }

    // ###### Get Day Break Cards ######
    verifyGetDayBreakCardsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.GET_DAY_BREAK_CARDS);
    }

    async processGetDayBreakCardsEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.GET_DAY_BREAK_CARDS);
    }

    // ###### Activate Day Break ######
    verifyActivateDayBreakEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.DAY_BREAK_CARD);
    }

    async processActivateDayBreakEvent(gameId: gameId) {
        await this.processEventAndSaveState(gameId, TransitionEvent.DAY_BREAK_CARD);
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