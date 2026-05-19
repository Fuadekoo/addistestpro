import { Router } from "express";
import {
  createSong,
  deleteSong,
  getSongById,
  getSongStatistics,
  listSongs,
  updateSong,
} from "../controllers/song.controller.js";

const songRouter = Router();

songRouter.get("/stats", getSongStatistics);
songRouter.get("/", listSongs);
songRouter.get("/:id", getSongById);
songRouter.post("/", createSong);
songRouter.patch("/:id", updateSong);
songRouter.delete("/:id", deleteSong);

export default songRouter;
