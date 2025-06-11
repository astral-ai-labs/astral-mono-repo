import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// DB Schemas
import * as astralSchema from "./schemas/astral-schema";
import * as logsSchema from "./schemas/logs-schema";

config({ path: ".env" }); // or .env.local

const astralClient = postgres(process.env.ASTRAL_DATABASE_URL!, {
  prepare: false,
});
export const astralDb = drizzle({ client: astralClient, schema: astralSchema });

const logsClient = postgres(process.env.LOGS_DATABASE_URL!, {
  prepare: false,
});
export const logsDb = drizzle({ client: logsClient, schema: logsSchema });
