import { z } from "zod";
import { Team } from "../models/Team/Team";
import { ConGame, GameState } from "../models";
export type gameId = string;

export type TeamOrder = {
  first: Team;
  second: Team;
}

export type GameStateInfo = {
  game: ConGame;
  state: GameState;
}

export const OnePlayerSpaceOptionsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
export const AllSpaceOptionsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
]);

export const SpaceOptionsSchema = z.union([OnePlayerSpaceOptionsSchema, AllSpaceOptionsSchema]);

export type OnePlayerSpaceOptions = z.infer<typeof OnePlayerSpaceOptionsSchema>;
export type TwoPlayerSpaceOptions = z.infer<typeof AllSpaceOptionsSchema>;
export type SpaceOption = z.infer<typeof SpaceOptionsSchema>;