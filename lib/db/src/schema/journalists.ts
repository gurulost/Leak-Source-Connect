import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const journalistsTable = pgTable("journalists", {
  id: serial("id").primaryKey(),
  displayName: text("display_name").notNull(),
  outlet: text("outlet").notNull(),
  bio: text("bio").notNull(),
  specializations: text("specializations").array().notNull().default([]),
  verificationBadge: boolean("verification_badge").notNull().default(false),
  leaksClaimed: integer("leaks_claimed").notNull().default(0),
  leaksPublished: integer("leaks_published").notNull().default(0),
  avatarInitials: text("avatar_initials").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertJournalistSchema = createInsertSchema(journalistsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertJournalist = z.infer<typeof insertJournalistSchema>;
export type Journalist = typeof journalistsTable.$inferSelect;
