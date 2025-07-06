import { z } from "zod";
require('dotenv').config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().default(3003),
    DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);