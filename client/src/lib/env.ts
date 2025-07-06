import { z } from "zod";

// Only validate client-side variables (safe for browser)
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  NEXT_PUBLIC_SOCKET_URL: z.string().min(1).default('http://localhost:3003'),
});

// Export client-side env (safe for browser)
export const env = clientEnvSchema.parse(process.env);

// Server-side validation function (only call on server)
export const getServerEnv = () => {
  const serverEnvSchema = clientEnvSchema.extend({
    JWT_SECRET: z.string().min(1),
    MONGODB_URI: z.string().min(1),
    MONGODB_DB: z.string().min(1)
  });
  return serverEnvSchema.parse(process.env);
};