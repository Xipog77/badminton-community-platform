import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import postsRouter from "./posts";
import matchesRouter from "./matches";
import productsRouter from "./products";
import clansRouter from "./clans";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(postsRouter);
router.use(matchesRouter);
router.use(productsRouter);
router.use(clansRouter);

export default router;
