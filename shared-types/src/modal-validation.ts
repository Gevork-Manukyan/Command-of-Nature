import { z } from "zod";
import { CardSchema, ElementalCardSchema, ItemCardSchema } from "./card-classes";
import { OptionalAbilityCardSchema, SageSchema } from "./card-types";
import { DecklistSchema } from "./Decklist";
import { SpaceOptionsSchema } from "./space-options";

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
    hand: z.array(CardSchema.merge(OptionalAbilityCardSchema)),
    deck: z.array(CardSchema.merge(OptionalAbilityCardSchema)),
    discardPile: z.array(CardSchema.merge(OptionalAbilityCardSchema)),
});

export const BattlefieldSpaceSchema = z.lazy(() => z.object({
      spaceNumber: SpaceOptionsSchema,
      value: ElementalCardSchema.merge(OptionalAbilityCardSchema).nullable(),
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
    removedCards: z.array(CardSchema.merge(OptionalAbilityCardSchema)),
});

export const ConGameSchema = z.object({
    id: z.string(),
    gameName: z.string(),
    isPrivate: z.boolean(),
    password: z.string().nullable(),
    isStarted: z.boolean(),
    hasFinishedSetup: z.boolean(),
    numPlayersTotal: z.literal(2).or(z.literal(4)),
    numPlayersReady: z.number(),
    numPlayersFinishedSetup: z.number(),
    players: z.array(PlayerSchema),
    team1: TeamSchema,
    team2: TeamSchema,
    teamOrder: z.object({
        first: z.number(),
        second: z.number(),
    }),
    creatureShop: z.array(ElementalCardSchema.merge(OptionalAbilityCardSchema)),
    itemShop: z.array(ItemCardSchema.merge(OptionalAbilityCardSchema)),
});

export const ActiveConGameSchema = ConGameSchema.extend({
    id: z.string(),
    gameName: z.string(),
    isPrivate: z.boolean(),
    password: z.string().nullable(),
    isStarted: z.boolean(),
    hasFinishedSetup: z.boolean(),
});