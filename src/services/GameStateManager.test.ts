import { ConGame } from "../models/ConGame/ConGame";
import { GameStateManager } from "./GameStateManager";
import { gameId } from "../types";
import { GameConflictError } from "./CustomError/GameError";

describe("GameStateManager", () => {
    let gameStateManager: GameStateManager;
    let mockGame: ConGame;
    const testGameId = 'test-game-id' as gameId;
    const numPlayers = 4;

    beforeEach(() => {
        gameStateManager = GameStateManager.getInstance();
        gameStateManager.resetGameStateManager();
        mockGame = new ConGame(numPlayers, 'test-game', false, '');
        mockGame.setId(testGameId);
    });

    describe("getInstance", () => {
        test("returns the same instance on multiple calls", () => {
            const instance1 = GameStateManager.getInstance();
            const instance2 = GameStateManager.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe("getGame", () => {
        test("returns the game for a valid game ID", () => {
            gameStateManager.createGame(4, 'test-game', false, '');
            const retrievedGame = gameStateManager.getGame("game-1" as gameId);
            expect(retrievedGame).toBe(mockGame);
        });

        test("throws an error for a non-existent game ID", () => {
            expect(() => gameStateManager.getGame("non-existent-game" as gameId)).toThrow(GameConflictError);
        });
    });

    describe("createGame", () => {
        test("creates a new game with the given number of players", async () => {
            const newGame = await gameStateManager.createGame(4, 'test-game', false, '');
            expect(newGame.game.numPlayersTotal).toBe(4);
        });

        test("throws an error if a game with the ID already exists", async () => {
            await gameStateManager.createGame(4, 'test-game', false, '');
            await expect(gameStateManager.createGame(4, 'test-game', false, '')).rejects.toThrow(GameConflictError);
        });
    });

    describe("deleteGame", () => {
        test("deletes an existing game", async () => {
            await gameStateManager.createGame(4, 'test-game', false, '');
            gameStateManager.deleteGame(mockGame.id as gameId);
            expect(() => gameStateManager.getGame(mockGame.id as gameId)).toThrow(GameConflictError);
        });

        test("does not throw an error when deleting a non-existent game", () => {
            expect(() => gameStateManager.deleteGame("non-existent-game" as gameId)).not.toThrow();
        });
    });

    describe("resetGameStateManager", () => {
        test("clears all games", async () => {
            await gameStateManager.createGame(4, 'test-game', false, '');
            gameStateManager.resetGameStateManager();
            expect(() => gameStateManager.getGame(mockGame.id as gameId)).toThrow(GameConflictError);
        });
    });
});
