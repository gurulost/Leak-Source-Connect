import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leaksTable = pgTable("leaks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  teaser: text("teaser").notNull(),
  category: text("category").notNull(),
  sensitivity: text("sensitivity").notNull().default("medium"),
  status: text("status").notNull().default("pending"),
  anonymousHandle: text("anonymous_handle").notNull(),
  documentCount: integer("document_count").notNull().default(1),
  claimedByJournalistId: integer("claimed_by_journalist_id"),
  claimedByJournalistName: text("claimed_by_journalist_name"),
  viewCount: integer("view_count").notNull().default(0),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLeakSchema = createInsertSchema(leaksTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLeak = z.infer<typeof insertLeakSchema>;
export type Leak = typeof leaksTable.$inferSelect;
