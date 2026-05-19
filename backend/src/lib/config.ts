import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFileCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(__dirname, "../../.env"),
];

const envFilePath = envFileCandidates.find((candidate) => existsSync(candidate));

if (envFilePath) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config();
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNumberEnv(name: string, defaultValue: number): number {
  const rawValue = process.env[name];

  if (!rawValue) {
    return defaultValue;
  }

  const parsedValue = Number(rawValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsedValue;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

export const config = {
  env: nodeEnv,
  isDevelopment: nodeEnv === "development",
  isProduction: nodeEnv === "production",
  host: process.env.HOST ?? "0.0.0.0",
  port: getNumberEnv("PORT", 5000),
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
} as const;

export default config;
