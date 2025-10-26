import { ConGame, GameState, ActiveConGame } from "./models";
import { ConGame as ConGamePrisma } from "@prisma/client";

export type gameId = string;

export type GameStateInfo = {
  game: ConGame | ActiveConGame;
  state: GameState;
}

export type CleanConGamePrisma = Omit<ConGamePrisma, "createdAt" | "updatedAt">;