import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform((val) => parseInt(val, 10)).default("4000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  FIREBASE_PROJECT_ID: z.string().optional().default("liferpg-local"),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  USE_FIREBASE_EMULATOR: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  DEV_AUTH_BYPASS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  GEMINI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
