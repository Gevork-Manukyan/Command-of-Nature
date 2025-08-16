import { ConGameService } from "./con-game.service";
import { ConGame } from "./ConGame";
import { NotFoundError } from "../../custom-errors";

// Mock the Prisma client
jest.mock("../../lib/prisma", () => ({
    prisma: {
        conGame: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe("ConGameService", () => {
    let conGameService: ConGameService;
    const testGameId = "test-game-123";
    const testNumPlayers = 2;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        conGameService = new ConGameService();
    });

    describe("createGame", () => {
        it("should create a new game", async () => {
            const mockGame = new ConGame(2, "test-game", false, "");
            const mockPrismaData = mockGame.toPrismaObject();

            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.create as jest.Mock).mockResolvedValue(
                mockPrismaData
            );

            const result = await conGameService.createGame(
                2,
                "test-game",
                false,
                ""
            );

            expect(prisma.conGame.create).toHaveBeenCalledWith({
                data: mockPrismaData,
            });
            expect(result).toBeInstanceOf(ConGame);
        });
    });

    describe("findGameById", () => {
        it("should find a game by id", async () => {
            const mockGame = new ConGame(2, "test-game", false, "");
            const mockPrismaData = mockGame.toPrismaObject();

            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.findUnique as jest.Mock).mockResolvedValue(
                mockPrismaData
            );

            const result = await conGameService.findGameById(testGameId);

            expect(prisma.conGame.findUnique).toHaveBeenCalledWith({
                where: { id: testGameId },
            });
            expect(result).toBeInstanceOf(ConGame);
        });

        it("should throw NotFoundError when game not found", async () => {
            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(
                conGameService.findGameById(testGameId)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("findAllGames", () => {
        it("should find all games", async () => {
            const mockGames = [
                new ConGame(2, "game1", false, ""),
                new ConGame(4, "game2", false, ""),
            ];
            const mockPrismaData = mockGames.map((game) =>
                game.toPrismaObject()
            );

            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.findMany as jest.Mock).mockResolvedValue(
                mockPrismaData
            );

            const result = await conGameService.findAllGames();

            expect(prisma.conGame.findMany).toHaveBeenCalledWith();
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(ConGame);
            expect(result[1]).toBeInstanceOf(ConGame);
        });
    });

    describe("updateGameState", () => {
        it("should update game state", async () => {
            const mockGame = new ConGame(2, "test-game", false, "");
            mockGame.setId(testGameId);
            const mockPrismaData = mockGame.toPrismaObject();

            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.update as jest.Mock).mockResolvedValue(
                mockPrismaData
            );

            const result = await conGameService.updateGameState(
                testGameId,
                mockGame
            );

            expect(prisma.conGame.update).toHaveBeenCalledWith({
                where: { id: testGameId },
                data: mockPrismaData,
            });
            expect(result).toBeInstanceOf(ConGame);
        });

        it("should throw NotFoundError when game not found", async () => {
            const mockGame = new ConGame(2, "test-game", false, "");
            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.update as jest.Mock).mockResolvedValue(null);

            await expect(
                conGameService.updateGameState(testGameId, mockGame)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteGame", () => {
        it("should delete a game", async () => {
            const { prisma } = require("../../lib/prisma");
            (prisma.conGame.delete as jest.Mock).mockResolvedValue({
                id: testGameId,
            });

            await conGameService.deleteGame(testGameId);

            expect(prisma.conGame.delete).toHaveBeenCalledWith({
                where: { id: testGameId },
            });
        });
    });
});
