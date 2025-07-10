import { z } from 'zod';
import { SageSchema } from './card-types';

export type GameListing = {
    id: string;
    gameName: string;
    isPrivate: boolean;
    numPlayersTotal: number;
    numCurrentPlayers: number;
}

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