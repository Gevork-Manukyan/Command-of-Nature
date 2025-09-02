import { z } from "zod";
import { State } from "./gamestate-types";
import { SageSchema } from "./card-types";

export const UserSetupSchema = z.object({
    userId: z.string(),
    username: z.string(),
    sage: SageSchema.nullable(),
    team: z.union([z.literal(1), z.literal(2)]).nullable(),
    isReady: z.boolean().default(false),
})
export type UserSetup = z.infer<typeof UserSetupSchema>;

export const NextStateDataSchema = z.object({
    nextState: z.nativeEnum(State),
});
export type NextStateData = z.infer<typeof NextStateDataSchema>;
