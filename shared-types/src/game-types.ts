import { z } from 'zod';
import { SageSchema } from './card-types';

export const GameListingSchema = z.object({
    id: z.string(),
    gameName: z.string(),
    isPrivate: z.boolean(),
    numPlayersTotal: z.number(),
    numCurrentPlayers: z.number(),
});
export type GameListing = z.infer<typeof GameListingSchema>;

export const SetupPhasesSchema = z.enum([
    "sage-selection",
    "team-formation",
    "warrior-selection",
    "warrior-swapping",
    "setup-complete",
]);

export const AvailableSagesSchema = z.object({
    Cedar: z.boolean(),
    Gravel: z.boolean(),
    Porella: z.boolean(),
    Torrent: z.boolean(),
});

export const SetupDataSchema = z.object({
    currentPhase: SetupPhasesSchema,
    availableSages: AvailableSagesSchema,
    selectedSage: SageSchema,
});


export type SetupPhase = z.infer<typeof SetupPhasesSchema>;