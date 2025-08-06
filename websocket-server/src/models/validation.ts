import {
    CardSchema,
    DecklistSchema,
    ElementalCardSchema,
    SageSchema,
    SpaceOptionsSchema,
} from "@shared-types";
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

export const BattlefieldSpaceSchema = z.lazy((): z.ZodType<any> => z.object({
      spaceNumber: SpaceOptionsSchema,
      value: ElementalCardSchema.nullable(),
      connections: z.object({
          TL: SpaceOptionsSchema.nullable(),
          T: SpaceOptionsSchema.nullable(),
          TR: SpaceOptionsSchema.nullable(),
          L: SpaceOptionsSchema.nullable(),
          R: SpaceOptionsSchema.nullable(),
          BL: SpaceOptionsSchema.nullable(),
          B: SpaceOptionsSchema.nullable(),
          BR: SpaceOptionsSchema.nullable(),
      }),
  })
);

export const BattlefieldSchema = z.object({
    fieldArray: z.array(BattlefieldSpaceSchema),
    numPlayersOnTeam: z.literal(1).or(z.literal(2)),
});

export const TeamSchema = z.object({
    userIds: z.array(z.string()),
    battlefield: BattlefieldSchema,
    teamNumber: z.literal(1).or(z.literal(2)),
    teamSize: z.literal(1).or(z.literal(2)),
    gold: z.number().default(0),
    maxGold: z.literal(12).or(z.literal(20)),
    removedCards: z.array(CardSchema),
});
