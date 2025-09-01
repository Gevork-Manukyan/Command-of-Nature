import { z } from "zod";

export const UserProfileSchema = z.object({
    username: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
