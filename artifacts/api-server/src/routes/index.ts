import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leaksRouter from "./leaks";
import journalistsRouter from "./journalists";
import categoriesRouter from "./categories";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leaksRouter);
router.use(journalistsRouter);
router.use(categoriesRouter);
router.use(statsRouter);

export default router;
