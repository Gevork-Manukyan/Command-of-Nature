import { z } from 'zod';

export const GameListingSchema = z.object({
    id: z.string(),
    gameName: z.string(),
    isPrivate: z.boolean(),
    numPlayersTotal: z.union([z.literal(2), z.literal(4)]),
    numCurrentPlayers: z.number(),
});
export type GameListing = z.infer<typeof GameListingSchema>;

export const AvailableSagesSchema = z.object({
    Cedar: z.boolean(),
    Gravel: z.boolean(),
    Porella: z.boolean(),
    Torrent: z.boolean(),
});
export type AvailableSages = z.infer<typeof AvailableSagesSchema>;