import { Router, type IRouter } from "express";
import { db, categoriesTable, leaksTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);

  const withCounts = await Promise.all(
    cats.map(async (cat) => {
      const [result] = await db
        .select({ count: count() })
        .from(leaksTable)
        .where(eq(leaksTable.category, cat.slug));
      return {
        ...cat,
        leakCount: Number(result?.count ?? 0),
        createdAt: cat.createdAt.toISOString(),
        updatedAt: cat.updatedAt.toISOString(),
      };
    })
  );

  res.json(withCounts);
});

export default router;
