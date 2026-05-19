import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import SongModel from "../models/songModel.js";
import { sanitizeDocument } from "../utils/document.util.js";
import { buildTextFilter } from "../utils/query.util.js";
import {
  validateCreateSongInput,
  validateSongListQuery,
  validateUpdateSongInput,
} from "../validators/song.validator.js";

// this is a create a song controller, it will validate the input, check for duplicates, and create a new song in the database

export async function createSong(req: Request, res: Response, next: NextFunction): Promise<void> {
  const validation = validateCreateSongInput(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
    return;
  }

  const { title, artist, album, genre } = validation.data;

  try {
    const existingSong = await SongModel.findOne({ title, artist, album }).lean();

    if (existingSong) {
      res.status(409).json({
        success: false,
        message: "This song already exists for the same artist and album.",
      });
      return;
    }

    const song = await SongModel.create({ title, artist, album, genre });

    res.status(201).json({
      success: true,
      message: "Song created successfully.",
      song: sanitizeDocument(song),
    });
  } catch (error) {
    next(error);
  }
}

// this is a list songs controller
export async function listSongs(req: Request, res: Response, next: NextFunction): Promise<void> {
  const validation = validateSongListQuery(req.query);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
    return;
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

    res.status(200).json({
      success: true,
      message: "Songs fetched successfully.",
      pagination: {
        page,
        limit,
        totalSongs,
        totalPages: Math.ceil(totalSongs / limit),
      },
      songs: songs.map((song) => sanitizeDocument(song)),
    });
  } catch (error) {
    next(error);
  }
}

// this is a get song by id controller
export async function getSongById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid song id.",
    });
    return;
  }

  try {
    const song = await SongModel.findById(id);

    if (!song) {
      res.status(404).json({
        success: false,
        message: "Song not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Song fetched successfully.",
      song: sanitizeDocument(song),
    });
  } catch (error) {
    next(error);
  }
}

// this is a update song controller 
export async function updateSong(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid song id.",
    });
    return;
  }

  const validation = validateUpdateSongInput(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
    return;
  }

  try {
    const song = await SongModel.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      res.status(404).json({
        success: false,
        message: "Song not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Song updated successfully.",
      song: sanitizeDocument(song),
    });
  } catch (error) {
    next(error);
  }
}

// this is a delete song controller
export async function deleteSong(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid song id.",
    });
    return;
  }

  try {
    const song = await SongModel.findByIdAndDelete(id);

    if (!song) {
      res.status(404).json({
        success: false,
        message: "Song not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Song deleted successfully.",
      song: sanitizeDocument(song),
    });
  } catch (error) {
    next(error);
  }
}

// this is a get song statistics controller
export async function getSongStatistics(_req: Request, res: Response, next: NextFunction): Promise<void> {
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
              $group: { _id: "$genre", songCount: { $sum: 1 } },
            },
            {
              $project: { _id: 0, genre: "$_id", songCount: 1 },
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
                  $push: { album: "$_id.album", songCount: "$songCount" },
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

    res.status(200).json({
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
    next(error);
  }
}
