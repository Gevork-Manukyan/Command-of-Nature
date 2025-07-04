import z from "zod";

export const registerFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;


export const userResponseSchema = z.object({
    id: z.string(),
    username: z.string(),
    isOnline: z.boolean(),
    gamesPlayed: z.number(),
    gamesWon: z.number(),
    activeGameIds: z.array(z.string()),
});
export type UserResponse = z.infer<typeof userResponseSchema>;

export const createGameFormSchema = z.object({
    gameName: z.string().min(3, "Game name must be at least 3 characters").max(20, "Game name must be less than 20 characters"),
    numPlayers: z.enum(["2", "4"]),
    isPrivate: z.boolean(),
    password: z.string().optional(),
});
export type CreateGameFormData = z.infer<typeof createGameFormSchema>;