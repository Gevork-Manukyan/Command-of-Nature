import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { userGames: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ userGames: user.userGames });
  } catch (error) {
    console.error("Error fetching user games:", error);
    return NextResponse.json(
      { error: "Error fetching user games" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { gameId } = await request.json();

    const userGame = await prisma.userGame.create({
      data: {
        userId: params.userId,
        gameId,
      },
    });

    return NextResponse.json({ success: true, userGame });
  } catch (error) {
    console.error("Error adding game to user:", error);
    return NextResponse.json(
      { error: "Error adding game to user" },
      { status: 500 }
    );
  }
}
