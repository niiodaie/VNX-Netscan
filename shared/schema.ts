import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  password: text("password"),
  email: text("email").unique().notNull(),
  name: text("name"),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  is_pro: boolean("is_pro").default(false).notNull(),
  role: text("role").default("viewer").notNull(), // super_admin, admin, analyst, viewer
  access_tag: text("access_tag"), // SA, AD, AN, VW
  status: text("status").default("active").notNull(), // active, pending, inactive
  provider: text("provider"), // oauth, email, manual_seed
  provider_id: text("provider_id"), // External provider user ID
  last_login: timestamp("last_login"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOAuthUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  avatar_url: true,
  is_pro: true,
  provider: true,
  provider_id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertOAuthUser = z.infer<typeof insertOAuthUserSchema>;
export type User = typeof users.$inferSelect;
