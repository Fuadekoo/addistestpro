import { Router, type Request, type Response } from "express";
import songRouter from "./song.route.js";

const apiRouter = Router();
export const rootRouter = Router();

function healthCheckHandler(_req: Request, res: Response): void {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

apiRouter.get("/health", healthCheckHandler);

apiRouter.use("/songs", songRouter);

export default apiRouter;
