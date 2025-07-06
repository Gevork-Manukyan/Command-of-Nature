import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  JWT_SECRET: z.string().min(1),
  NEXT_PUBLIC_SOCKET_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);