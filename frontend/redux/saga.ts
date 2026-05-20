import { all } from "redux-saga/effects";
import { watchSong } from "./song/songSaga";

export default function* rootSaga() {
  yield all([watchSong()]);
}
