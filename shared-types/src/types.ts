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

export const WarriorSelectionStateSchema = z.enum(["selecting", "swapping", "finished"]);
export type WarriorSelectionState = z.infer<typeof WarriorSelectionStateSchema>;