import { NotFoundError } from "../../custom-errors";
import { prisma } from "../prisma";
import { User } from "@prisma/client";

export async function getUserByUserId(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new NotFoundError("User not found", "userId");
    }

    return user;
}

export async function getUserProfilesByGameId(
    gameId: string
) {
    const users = await prisma.userGame.findMany({
        where: {
            gameId,
        },
        include: {
            user: true,
        },
    });

    if (!users) {
        throw new NotFoundError("Users not found", "gameId");
    }

    return users.map((userGame) => ({
        userId: userGame.user.id,
        username: userGame.user.username,
    }));
}

export async function updateUserActiveGames(userId: string, gameId: string) {
    await prisma.userGame.create({
        data: {
            userId,
            gameId,
        },
    });
}

export async function deleteUserActiveGames(userId: string, gameId: string) {
    await prisma.userGame.delete({
        where: {
            userId_gameId: {
                userId,
                gameId,
            },
        },
    });
}

export async function getUserActiveGame(userId: string): Promise<string | null> {
    const userGame = await prisma.userGame.findFirst({
        where: {
            userId,
        },
        include: {
            game: {
                include: {
                    gameState: true,
                },
            },
        },
    });

    if (!userGame) {
        return null;
    }

    // Check if the game is still active (not finished)
    // A game is considered finished if it has no gameState or if the current state is GAME_FINISHED
    if (!userGame.game.gameState) {
        return null;
    }

    // Parse the currentTransition JSON to check the current state
    const currentTransition = userGame.game.gameState.currentTransition as any;
    const currentState = currentTransition?.currentState;
    if (currentState === "game-finished") {
        return null;
    }

    return userGame.gameId;
}