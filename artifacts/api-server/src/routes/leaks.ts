import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, leaksTable, journalistsTable, activityEventsTable } from "@workspace/db";
import {
  ListLeaksQueryParams,
  CreateLeakBody,
  GetLeakParams,
  UpdateLeakParams,
  UpdateLeakBody,
  ClaimLeakParams,
  ClaimLeakBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateHandle(): string {
  const adjectives = ["ghost", "phantom", "shadow", "cipher", "veil", "echo", "specter", "wraith", "mirage", "signal"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj}-${num}`;
}

router.get("/leaks", async (req, res): Promise<void> => {
  const parsed = ListLeaksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, status, sensitivity, search } = parsed.data;

  const conditions: SQL[] = [];

  if (category) {
    conditions.push(eq(leaksTable.category, category));
  }
  if (status) {
    conditions.push(eq(leaksTable.status, status));
  }
  if (sensitivity) {
    conditions.push(eq(leaksTable.sensitivity, sensitivity));
  }
  if (search) {
    conditions.push(ilike(leaksTable.title, `%${search}%`));
  }

  const leaks = conditions.length > 0
    ? await db.select().from(leaksTable).where(and(...conditions)).orderBy(leaksTable.createdAt)
    : await db.select().from(leaksTable).orderBy(leaksTable.createdAt);

  res.json(leaks.map(l => ({
    ...l,
    verifiedAt: l.verifiedAt ? l.verifiedAt.toISOString() : null,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  })));
});

router.post("/leaks", async (req, res): Promise<void> => {
  const parsed = CreateLeakBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const handle = generateHandle();
  const [leak] = await db.insert(leaksTable).values({
    ...parsed.data,
    anonymousHandle: handle,
    status: "pending",
    viewCount: 0,
  }).returning();

  await db.insert(activityEventsTable).values({
    eventType: "leak_submitted",
    description: `New leak submitted: "${leak.title.substring(0, 60)}${leak.title.length > 60 ? "..." : ""}"`,
    category: leak.category,
    sensitivity: leak.sensitivity,
    timestamp: new Date(),
  });

  res.status(201).json({
    ...leak,
    verifiedAt: leak.verifiedAt ? leak.verifiedAt.toISOString() : null,
    createdAt: leak.createdAt.toISOString(),
    updatedAt: leak.updatedAt.toISOString(),
  });
});

router.get("/leaks/:id", async (req, res): Promise<void> => {
  const params = GetLeakParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [leak] = await db.select().from(leaksTable).where(eq(leaksTable.id, params.data.id));
  if (!leak) {
    res.status(404).json({ error: "Leak not found" });
    return;
  }

  await db.update(leaksTable).set({ viewCount: leak.viewCount + 1 }).where(eq(leaksTable.id, leak.id));

  res.json({
    ...leak,
    viewCount: leak.viewCount + 1,
    verifiedAt: leak.verifiedAt ? leak.verifiedAt.toISOString() : null,
    createdAt: leak.createdAt.toISOString(),
    updatedAt: leak.updatedAt.toISOString(),
  });
});

router.patch("/leaks/:id", async (req, res): Promise<void> => {
  const params = UpdateLeakParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateLeakBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.verifiedAt !== undefined) {
    updateData.verifiedAt = parsed.data.verifiedAt ? new Date(parsed.data.verifiedAt) : null;
  }

  const [leak] = await db
    .update(leaksTable)
    .set(updateData)
    .where(eq(leaksTable.id, params.data.id))
    .returning();

  if (!leak) {
    res.status(404).json({ error: "Leak not found" });
    return;
  }

  if (parsed.data.status === "verified") {
    await db.insert(activityEventsTable).values({
      eventType: "leak_verified",
      description: `Leak verified: "${leak.title.substring(0, 60)}${leak.title.length > 60 ? "..." : ""}"`,
      category: leak.category,
      sensitivity: leak.sensitivity,
      timestamp: new Date(),
    });
  } else if (parsed.data.status === "published") {
    await db.insert(activityEventsTable).values({
      eventType: "leak_published",
      description: `Leak published: "${leak.title.substring(0, 60)}${leak.title.length > 60 ? "..." : ""}"`,
      category: leak.category,
      sensitivity: leak.sensitivity,
      timestamp: new Date(),
    });
  }

  res.json({
    ...leak,
    verifiedAt: leak.verifiedAt ? leak.verifiedAt.toISOString() : null,
    createdAt: leak.createdAt.toISOString(),
    updatedAt: leak.updatedAt.toISOString(),
  });
});

router.post("/leaks/:id/claim", async (req, res): Promise<void> => {
  const params = ClaimLeakParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = ClaimLeakBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [journalist] = await db.select().from(journalistsTable).where(eq(journalistsTable.id, parsed.data.journalistId));
  if (!journalist) {
    res.status(404).json({ error: "Journalist not found" });
    return;
  }

  const [leak] = await db
    .update(leaksTable)
    .set({
      status: "claimed",
      claimedByJournalistId: journalist.id,
      claimedByJournalistName: journalist.displayName,
    })
    .where(eq(leaksTable.id, params.data.id))
    .returning();

  if (!leak) {
    res.status(404).json({ error: "Leak not found" });
    return;
  }

  await db.update(journalistsTable).set({ leaksClaimed: journalist.leaksClaimed + 1 }).where(eq(journalistsTable.id, journalist.id));

  await db.insert(activityEventsTable).values({
    eventType: "leak_claimed",
    description: `${journalist.displayName} from ${journalist.outlet} claimed: "${leak.title.substring(0, 50)}${leak.title.length > 50 ? "..." : ""}"`,
    category: leak.category,
    sensitivity: leak.sensitivity,
    timestamp: new Date(),
  });

  res.json({
    ...leak,
    verifiedAt: leak.verifiedAt ? leak.verifiedAt.toISOString() : null,
    createdAt: leak.createdAt.toISOString(),
    updatedAt: leak.updatedAt.toISOString(),
  });
});

export default router;
