import { CardSchema, DecklistSchema, SageSchema } from "@shared-types";
import { z } from "zod";

export const PlayerSchema = z.object({
  userId: z.string(),
  socketId: z.string(),
  isReady: z.boolean(),
  isSetup: z.boolean(),
  hasChosenWarriors: z.boolean(),
  isGameHost: z.boolean(),
  sage: SageSchema.nullable(),
  decklist: DecklistSchema.nullable(),
  level: z.number(),
  hand: z.array(CardSchema),
  deck: z.array(CardSchema),
  discardPile: z.array(CardSchema),
});

export const BattlefieldSchema = z.object({})

export const TeamSchema = z.object({
  userIds: z.array(z.string()),
  battlefield: BattlefieldSchema,
  teamNumber: z.literal(1).or(z.literal(2)),
  teamSize: z.literal(1).or(z.literal(2)),
  gold: z.number().default(0),
  maxGold: z.literal(12).or(z.literal(20)),
  removedCards: z.array(CardSchema),
})