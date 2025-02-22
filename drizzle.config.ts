import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/index.ts",
  dialect: "sqlite",
  out: "./db/migrations",
  dbCredentials: {
    url: "file:./sqlite.db",
  },
  verbose: true,
  strict: true,
});
