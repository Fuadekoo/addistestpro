import axios from "axios";
import type {
  SongListResponse,
  SongMutationResponse,
  SongPayload,
  SongStatisticsResponse,
} from "./songTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const fetchSongsApi = async (): Promise<SongListResponse> => {
  const response = await axios.get<SongListResponse>(`${BASE_URL}/songs`, {
    params: {
      limit: 100,
      sortBy: "updatedAt",
      sortOrder: "desc",
    },
  });
  return response.data;
};

export const createSongApi = async (
  data: SongPayload,
): Promise<SongMutationResponse> => {
  const response = await axios.post<SongMutationResponse>(`${BASE_URL}/songs`, data);
  return response.data;
};

export const updateSongApi = async (
  id: string,
  data: SongPayload,
): Promise<SongMutationResponse> => {
  const response = await axios.patch<SongMutationResponse>(
    `${BASE_URL}/songs/${id}`,
    data,
  );

  return response.data;
};

export const deleteSongApi = async (id: string): Promise<SongMutationResponse> => {
  const response = await axios.delete<SongMutationResponse>(`${BASE_URL}/songs/${id}`);

  return response.data;
};

export const fetchSongStatisticsApi = async (): Promise<SongStatisticsResponse> => {
  const response = await axios.get<SongStatisticsResponse>(`${BASE_URL}/songs/stats`);
  return response.data;
};
