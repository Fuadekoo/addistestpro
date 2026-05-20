import axios from "axios";
import { toast } from "sonner";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import {
  createSongApi,
  deleteSongApi,
  fetchSongsApi,
  updateSongApi,
} from "./songApi";
import type { SongListResponse, SongMutationResponse, SongPayload } from "./songTypes";

import {
  createSong,
  deleteSong,
  getSongs,
  setSongError,
  setSongMutationSuccess,
  setSongs,
  updateSong,
} from "./songSlice";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "Something went wrong while processing songs."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while processing songs.";
}

function* syncSongs(): any {
  const data: SongListResponse = yield call(fetchSongsApi);

  yield put(
    setSongs({
      songs: data.songs,
      pagination: data.pagination,
    }),
  );
}

function* fetchSongs(): any {
  try {
    yield call(syncSongs);
  } catch (error) {
    yield put(setSongError(getErrorMessage(error)));
    toast.error(getErrorMessage(error));
  }
}

function* createSongFlow(action: { payload: SongPayload }): any {
  try {
    const response: SongMutationResponse = yield call(createSongApi, action.payload);

    yield call(syncSongs);
    yield put(
      setSongMutationSuccess({
        kind: "create",
        message: response.message,
      }),
    );
    toast.success(response.message);
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(setSongError(message));
    toast.error(message);
  }
}

function* updateSongFlow(action: {
  payload: { id: string; data: SongPayload };
}): any {
  try {
    const response: SongMutationResponse = yield call(
      updateSongApi,
      action.payload.id,
      action.payload.data,
    );

    yield call(syncSongs);
    yield put(
      setSongMutationSuccess({
        kind: "update",
        message: response.message,
      }),
    );
    toast.success(response.message);
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(setSongError(message));
    toast.error(message);
  }
}

function* deleteSongFlow(action: { payload: string }): any {
  try {
    const response: SongMutationResponse = yield call(deleteSongApi, action.payload);

    yield call(syncSongs);
    yield put(
      setSongMutationSuccess({
        kind: "delete",
        message: response.message,
      }),
    );
    toast.success(response.message);
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(setSongError(message));
    toast.error(message);
  }
}

export function* watchSong() {
  yield takeLatest(getSongs.type, fetchSongs);
  yield takeEvery(createSong.type as any, createSongFlow);
  yield takeEvery(updateSong.type as any, updateSongFlow);
  yield takeEvery(deleteSong.type as any, deleteSongFlow);
}
