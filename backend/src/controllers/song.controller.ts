import type { Request, Response } from "express";
import mongoose from "mongoose";
import SongModel from "../models/songModel.js";
import {
  validateCreateSongInput,
  validateSongListQuery,
  validateUpdateSongInput,
} from "../validators/song.validator.js";

function sendServerError(res: Response, error: unknown, fallbackMessage: string): Response {
  const message = error instanceof Error ? error.message : fallbackMessage;
  return res.status(500).json({
    success: false,
    message,
  });
}

function hasToObject(value: unknown): value is { toObject(): Record<string, unknown> } {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as { toObject?: unknown }).toObject === "function";
}

function sanitizeSong(song: { toObject(): Record<string, unknown> } | Record<string, unknown>): Record<string, unknown> {
  const normalizedSong = hasToObject(song) ? song.toObject() : { ...song };
  delete normalizedSong.__v;
  return normalizedSong;
}

function buildTextFilter(value?: string): { $regex: string; $options: string } | undefined {
  if (!value) {
    return undefined;
  }

  return {
    $regex: value,
    $options: "i",
  };
}

export async function createSong(req: Request, res: Response): Promise<Response> {
  const validation = validateCreateSongInput(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { title, artist, album, genre } = validation.data;

  try {
    const existingSong = await SongModel.findOne({ title, artist, album }).lean();

    if (existingSong) {
      return res.status(409).json({
        success: false,
        message: "This song already exists for the same artist and album.",
      });
    }

    const song = await SongModel.create({
      title,
      artist,
      album,
      genre,
    });

    return res.status(201).json({
      success: true,
      message: "Song created successfully.",
      song: sanitizeSong(song),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to create song.");
  }
}

export async function listSongs(req: Request, res: Response): Promise<Response> {
  const validation = validateSongListQuery(req.query);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { page, limit, search, artist, album, genre, sortBy, sortOrder } = validation.data;
  const searchFilter = buildTextFilter(search);
  const filters = {
    ...(searchFilter
      ? {
          $or: [
            { title: searchFilter },
            { artist: searchFilter },
            { album: searchFilter },
            { genre: searchFilter },
          ],
        }
      : {}),
    ...(artist ? { artist: buildTextFilter(artist) } : {}),
    ...(album ? { album: buildTextFilter(album) } : {}),
    ...(genre ? { genre: buildTextFilter(genre) } : {}),
  };

  try {
    const [songs, totalSongs] = await Promise.all([
      SongModel.find(filters)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      SongModel.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully.",
      pagination: {
        page,
        limit,
        totalSongs,
        totalPages: Math.ceil(totalSongs / limit),
      },
      songs: songs.map((song) => sanitizeSong(song)),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to fetch songs.");
  }
}

export async function getSongById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid song id.",
    });
  }

  try {
    const song = await SongModel.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song fetched successfully.",
      song: sanitizeSong(song),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to fetch song.");
  }
}

export async function updateSong(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid song id.",
    });
  }

  const validation = validateUpdateSongInput(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    const song = await SongModel.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song updated successfully.",
      song: sanitizeSong(song),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to update song.");
  }
}

export async function deleteSong(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid song id.",
    });
  }

  try {
    const song = await SongModel.findByIdAndDelete(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully.",
      song: sanitizeSong(song),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to delete song.");
  }
}

export async function getSongStatistics(_req: Request, res: Response): Promise<Response> {
  try {
    const [stats] = await SongModel.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalSongs: { $sum: 1 },
                artists: { $addToSet: "$artist" },
                albums: { $addToSet: "$album" },
                genres: { $addToSet: "$genre" },
              },
            },
            {
              $project: {
                _id: 0,
                totalSongs: 1,
                totalArtists: { $size: "$artists" },
                totalAlbums: { $size: "$albums" },
                totalGenres: { $size: "$genres" },
              },
            },
          ],
          songsPerGenre: [
            {
              $group: {
                _id: "$genre",
                songCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                genre: "$_id",
                songCount: 1,
              },
            },
            { $sort: { songCount: -1, genre: 1 } },
          ],
          songsPerAlbum: [
            {
              $group: {
                _id: { album: "$album", artist: "$artist" },
                songCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                album: "$_id.album",
                artist: "$_id.artist",
                songCount: 1,
              },
            },
            { $sort: { songCount: -1, album: 1, artist: 1 } },
          ],
          songsPerArtist: [
            {
              $group: {
                _id: "$artist",
                songCount: { $sum: 1 },
                albums: { $addToSet: "$album" },
              },
            },
            {
              $project: {
                _id: 0,
                artist: "$_id",
                songCount: 1,
                albumCount: { $size: "$albums" },
                albums: 1,
              },
            },
            { $sort: { songCount: -1, artist: 1 } },
          ],
          artistAlbumBreakdown: [
            {
              $group: {
                _id: { artist: "$artist", album: "$album" },
                songCount: { $sum: 1 },
              },
            },
            { $sort: { "_id.artist": 1, "_id.album": 1 } },
            {
              $group: {
                _id: "$_id.artist",
                songCount: { $sum: "$songCount" },
                albumCount: { $sum: 1 },
                albums: {
                  $push: {
                    album: "$_id.album",
                    songCount: "$songCount",
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                artist: "$_id",
                songCount: 1,
                albumCount: 1,
                albums: 1,
              },
            },
            { $sort: { songCount: -1, artist: 1 } },
          ],
        },
      },
    ]);

    const totals = stats?.totals?.[0] ?? {
      totalSongs: 0,
      totalArtists: 0,
      totalAlbums: 0,
      totalGenres: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Song statistics fetched successfully.",
      stats: {
        ...totals,
        songsPerGenre: stats?.songsPerGenre ?? [],
        songsPerAlbum: stats?.songsPerAlbum ?? [],
        songsPerArtist: stats?.songsPerArtist ?? [],
        artistAlbumBreakdown: stats?.artistAlbumBreakdown ?? [],
      },
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to fetch song statistics.");
  }
}
