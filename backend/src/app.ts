import express from "express";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import apiRouter, { rootRouter } from "./routers/index.js";

const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rootRouter);
app.use("/api", apiRouter);

export default app;
