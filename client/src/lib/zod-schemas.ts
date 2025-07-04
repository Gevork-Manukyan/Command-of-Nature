import z from "zod";

export const userResponseSchema = z.object({
    id: z.string(),
    username: z.string(),
    isOnline: z.boolean(),
    gamesPlayed: z.number(),
    gamesWon: z.number(),
    activeGameIds: z.array(z.string()),
});

export type UserResponse = z.infer<typeof userResponseSchema>;