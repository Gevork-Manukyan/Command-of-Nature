import { ConGameService, ConGame } from "../models";
import { GameStateService, GameState } from "../models";
import { GameStateInfo } from "../types";

export class GameDatabaseService {
    private static instance: GameDatabaseService;
    private conGameService: ConGameService;
    private gameStateService: GameStateService;

    private constructor(
        conGameService: ConGameService,
        gameStateService: GameStateService
    ) {
        this.conGameService = conGameService;
        this.gameStateService = gameStateService;
    }

    static getInstance(): GameDatabaseService {
        if (!GameDatabaseService.instance) {
            GameDatabaseService.instance = new GameDatabaseService(
                new ConGameService(),
                new GameStateService()
            );
        }
        return GameDatabaseService.instance;
    }

    /**
     * Creates and saves a new game to the database
     * @param numPlayersTotal - The number of players in the game
     * @returns The newly created/saved game and game state
     */
    async saveNewGame(
        numPlayersTotal: ConGame["numPlayersTotal"],
        gameName: ConGame["gameName"],
        isPrivate: ConGame["isPrivate"],
        password: ConGame["password"]
    ): Promise<GameStateInfo> {
        try {
            // First save the game to get its ID
            const savedGame = await this.conGameService.createGame(
                numPlayersTotal,
                gameName,
                isPrivate,
                password
            );

            // Create and save the game state with the new game ID
            const savedGameState = await this.gameStateService.createGameState(
                savedGame.id
            );

            return { game: savedGame, state: savedGameState };
        } catch (error) {
            console.error("Failed to save new game:", error);
            throw error;
        }
    }

    /**
     * Saves the game to the database
     * @param game - The game to save
     * @returns The saved game
     */
    async saveGame(game: ConGame): Promise<ConGame> {
        console.debug("Saving game:", game.id);
        try {
            return await this.conGameService.updateGameState(game.id, game);
        } catch (error) {
            console.error("Failed to save game:", error);
            throw error;
        }
    }

    /**
     * Saves the game state to the database
     * @param gameId - The ID of the game
     * @param gameState - The game state to save
     */
    async saveGameState(
        gameId: string,
        gameState: GameState
    ): Promise<GameState> {
        console.debug("Saving game state for game:", gameId);
        try {
            return await this.gameStateService.updateGameStateByGameId(
                gameId,
                gameState
            );
        } catch (error) {
            console.error("Failed to save game state:", error);
            throw error;
        }
    }

    /**
     * Gets a game by ID from the database
     */
    async findGameById(gameId: string): Promise<ConGame> {
        return this.conGameService.findGameById(gameId);
    }

    /**
     * Gets all games from the database
     */
    async findAllGames(): Promise<ConGame[]> {
        return this.conGameService.findAllGames();
    }

    /**
     * Gets a game state by game ID from the database
     */
    async findGameStateByGameId(gameId: string): Promise<GameState> {
        return this.gameStateService.findGameStateByGameId(gameId);
    }

    /**
     * Deletes a game and its state by ID from the database
     */
    async deleteGameAndState(gameId: string): Promise<void> {
        await Promise.all([
            this.conGameService.deleteGame(gameId),
            this.gameStateService.deleteGameStateByGameId(gameId),
        ]);
    }
}

export const gameDatabaseService = GameDatabaseService.getInstance();
