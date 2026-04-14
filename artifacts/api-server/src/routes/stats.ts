import { Router, type IRouter } from "express";
import { db, leaksTable, journalistsTable, categoriesTable, activityEventsTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/platform", async (_req, res): Promise<void> => {
  const [totalLeaksResult] = await db.select({ count: count() }).from(leaksTable);
  const [totalJournalistsResult] = await db.select({ count: count() }).from(journalistsTable);
  const [totalCategoriesResult] = await db.select({ count: count() }).from(categoriesTable);
  const [verifiedResult] = await db.select({ count: count() }).from(leaksTable).where(eq(leaksTable.status, "verified"));
  const [claimedResult] = await db.select({ count: count() }).from(leaksTable).where(eq(leaksTable.status, "claimed"));
  const [publishedResult] = await db.select({ count: count() }).from(leaksTable).where(eq(leaksTable.status, "published"));
  const [pendingResult] = await db.select({ count: count() }).from(leaksTable).where(eq(leaksTable.status, "pending"));
  const [criticalResult] = await db.select({ count: count() }).from(leaksTable).where(eq(leaksTable.sensitivity, "critical"));

  res.json({
    totalLeaks: Number(totalLeaksResult?.count ?? 0),
    totalJournalists: Number(totalJournalistsResult?.count ?? 0),
    totalCategories: Number(totalCategoriesResult?.count ?? 0),
    verifiedLeaks: Number(verifiedResult?.count ?? 0),
    claimedLeaks: Number(claimedResult?.count ?? 0),
    publishedLeaks: Number(publishedResult?.count ?? 0),
    pendingLeaks: Number(pendingResult?.count ?? 0),
    criticalLeaks: Number(criticalResult?.count ?? 0),
  });
});

router.get("/stats/recent-activity", async (_req, res): Promise<void> => {
  const events = await db
    .select()
    .from(activityEventsTable)
    .orderBy(activityEventsTable.timestamp)
    .limit(20);

  res.json(events.map(e => ({
    ...e,
    timestamp: e.timestamp.toISOString(),
  })).reverse());
});

router.get("/stats/sensitivity-breakdown", async (_req, res): Promise<void> => {
  const levels = ["low", "medium", "high", "critical"] as const;

  const breakdown = await Promise.all(
    levels.map(async (level) => {
      const [result] = await db.select({ count: count() }).from(leaksTable).where(eq(leaksTable.sensitivity, level));
      return {
        sensitivity: level,
        count: Number(result?.count ?? 0),
      };
    })
  );

  res.json(breakdown);
});

export default router;
