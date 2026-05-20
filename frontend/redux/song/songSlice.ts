import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Song,
  SongPagination,
  SongPayload,
} from "./songTypes";

type SongMutationKind = "create" | "update" | "delete";

type SongState = {
  songs: Song[];
  loading: boolean;
  saving: boolean;
  deletingId: string | null;
  error: string | null;
  pagination: SongPagination | null;
  lastMutation: {
    kind: SongMutationKind;
    message: string;
    timestamp: number;
  } | null;
};

const initialState: SongState = {
  songs: [],
  loading: false,
  saving: false,
  deletingId: null,
  error: null,
  pagination: null,
  lastMutation: null,
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    getSongs: (state) => {
      state.loading = true;
      state.error = null;
    },

    createSong: (state, _action: PayloadAction<SongPayload>) => {
      state.saving = true;
      state.error = null;
    },

    updateSong: (
      state,
      _action: PayloadAction<{ id: string; data: SongPayload }>,
    ) => {
      state.saving = true;
      state.error = null;
    },

    deleteSong: (state, action: PayloadAction<string>) => {
      state.deletingId = action.payload;
      state.error = null;
    },

    setSongs: (
      state,
      action: PayloadAction<{
        songs: Song[];
        pagination: SongPagination;
      }>,
    ) => {
      state.songs = action.payload.songs;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.saving = false;
      state.deletingId = null;
      state.error = null;
    },

    setSongError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.saving = false;
      state.deletingId = null;
      state.error = action.payload;
    },

    setSongMutationSuccess: (
      state,
      action: PayloadAction<{
        kind: SongMutationKind;
        message: string;
      }>,
    ) => {
      state.saving = false;
      state.deletingId = null;
      state.error = null;
      state.lastMutation = {
        kind: action.payload.kind,
        message: action.payload.message,
        timestamp: Date.now(),
      };
    },
  },
});

export const {
  getSongs,
  createSong,
  updateSong,
  deleteSong,
  setSongs,
  setSongError,
  setSongMutationSuccess,
} = songSlice.actions;
export default songSlice.reducer;
