"use server";

import { prisma } from "@/lib/server/prisma";

export async function getUserActiveGames(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: { userGames: true },
    });
}