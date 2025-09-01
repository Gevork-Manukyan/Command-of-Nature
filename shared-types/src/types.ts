import { z } from "zod";
import { State } from "./gamestate-types";

export const UserProfileSchema = z.object({
    username: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const NextStateDataSchema = z.object({
    nextState: z.nativeEnum(State),
});
export type NextStateData = z.infer<typeof NextStateDataSchema>;