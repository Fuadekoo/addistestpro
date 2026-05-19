import mongoose, { InferSchemaType, Model } from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "songs",
  }
);

export type Song = InferSchemaType<typeof songSchema>;

const SongModel: Model<Song> =
  mongoose.models.Song || mongoose.model<Song>("Song", songSchema);

export default SongModel;
