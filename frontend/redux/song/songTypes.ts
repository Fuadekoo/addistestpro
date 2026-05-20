export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
};

export type SongPayload = {
  title: string;
  artist: string;
  album: string;
  genre: string;
};

export type SongPagination = {
  page: number;
  limit: number;
  totalSongs: number;
  totalPages: number;
};

export type SongListResponse = {
  success: boolean;
  message: string;
  songs: Song[];
  pagination: SongPagination;
};

export type SongMutationResponse = {
  success: boolean;
  message: string;
  song: Song;
};

export type SongsPerGenreStat = {
  genre: string;
  songCount: number;
};

export type SongsPerAlbumStat = {
  album: string;
  artist: string;
  songCount: number;
};

export type SongsPerArtistStat = {
  artist: string;
  songCount: number;
  albumCount: number;
  albums: string[];
};

export type ArtistAlbumBreakdownStat = {
  artist: string;
  songCount: number;
  albumCount: number;
  albums: Array<{
    album: string;
    songCount: number;
  }>;
};

export type SongStatistics = {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsPerGenre: SongsPerGenreStat[];
  songsPerAlbum: SongsPerAlbumStat[];
  songsPerArtist: SongsPerArtistStat[];
  artistAlbumBreakdown: ArtistAlbumBreakdownStat[];
};

export type SongStatisticsResponse = {
  success: boolean;
  message: string;
  stats: SongStatistics;
};
