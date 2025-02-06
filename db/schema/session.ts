import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const session = sqliteTable("session", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  token: text("token"),
  userId: integer("user_id"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
});
