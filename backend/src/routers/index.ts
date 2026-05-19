import { Router } from "express";
import authRouter from "./auth.route.js";
import songRouter from "./song.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/songs", songRouter);

export default router;
