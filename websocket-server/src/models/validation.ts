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
