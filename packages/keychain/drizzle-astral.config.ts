import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

if (!process.env.ASTRAL_DATABASE_URL) {
  throw new Error("ASTRAL_DATABASE_URL is not set");
}

export default defineConfig({
  schema: "@workspace/keychain/src/db/schemas/astral-schema.ts",
  out: "@workspace/keychain/supabase/migrations/astral",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.ASTRAL_DATABASE_URL!,
  },
});
