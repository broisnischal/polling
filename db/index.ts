// import { Database } from "bun:sqlite";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema/index";


const sqlite = new Database("sqlite.db");

export const db = drizzle(sqlite, {
  schema,
});
