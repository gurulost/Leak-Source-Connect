import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, journalistsTable } from "@workspace/db";
import {
  CreateJournalistBody,
  GetJournalistParams,
  UpdateJournalistParams,
  UpdateJournalistBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
}

router.get("/journalists", async (_req, res): Promise<void> => {
  const journalists = await db.select().from(journalistsTable).orderBy(journalistsTable.createdAt);
  res.json(journalists.map(j => ({
    ...j,
    specializations: j.specializations ?? [],
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  })));
});

router.post("/journalists", async (req, res): Promise<void> => {
  const parsed = CreateJournalistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const avatarInitials = getInitials(parsed.data.displayName);
  const [journalist] = await db.insert(journalistsTable).values({
    ...parsed.data,
    avatarInitials,
    verificationBadge: false,
    leaksClaimed: 0,
    leaksPublished: 0,
  }).returning();

  res.status(201).json({
    ...journalist,
    specializations: journalist.specializations ?? [],
    createdAt: journalist.createdAt.toISOString(),
    updatedAt: journalist.updatedAt.toISOString(),
  });
});

router.get("/journalists/:id", async (req, res): Promise<void> => {
  const params = GetJournalistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [journalist] = await db.select().from(journalistsTable).where(eq(journalistsTable.id, params.data.id));
  if (!journalist) {
    res.status(404).json({ error: "Journalist not found" });
    return;
  }

  res.json({
    ...journalist,
    specializations: journalist.specializations ?? [],
    createdAt: journalist.createdAt.toISOString(),
    updatedAt: journalist.updatedAt.toISOString(),
  });
});

router.patch("/journalists/:id", async (req, res): Promise<void> => {
  const params = UpdateJournalistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateJournalistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.displayName !== undefined) {
    updateData.displayName = parsed.data.displayName;
    updateData.avatarInitials = parsed.data.displayName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  }
  if (parsed.data.outlet !== undefined) updateData.outlet = parsed.data.outlet;
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio;
  if (parsed.data.specializations !== undefined) updateData.specializations = parsed.data.specializations;

  const [journalist] = await db
    .update(journalistsTable)
    .set(updateData)
    .where(eq(journalistsTable.id, params.data.id))
    .returning();

  if (!journalist) {
    res.status(404).json({ error: "Journalist not found" });
    return;
  }

  res.json({
    ...journalist,
    specializations: journalist.specializations ?? [],
    createdAt: journalist.createdAt.toISOString(),
    updatedAt: journalist.updatedAt.toISOString(),
  });
});

export default router;
