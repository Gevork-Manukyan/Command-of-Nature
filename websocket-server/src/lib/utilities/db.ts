import { NotFoundError } from "src/custom-errors";
import { prisma } from "../prisma";
import { User } from "@prisma/client";
import { UserProfile } from "@shared-types";

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
): Promise<UserProfile[]> {
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