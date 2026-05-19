type ValidationErrors = Record<string, string>;

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationErrors };

export type CreateSongInput = {
  title: string;
  artist: string;
  album: string;
  genre: string;
};

export type UpdateSongInput = Partial<CreateSongInput>;

export type SongListQuery = {
  page: number;
  limit: number;
  search?: string;
  artist?: string;
  album?: string;
  genre?: string;
  sortBy: "title" | "artist" | "album" | "genre" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
};

function getBody(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }

  return {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(value: unknown): string | undefined {
  const normalizedValue = getString(value);
  return normalizedValue ? normalizedValue : undefined;
}

function getPositiveInteger(value: unknown, defaultValue: number): number | null {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function validateSongFields(
  payload: unknown,
  mode: "create" | "update"
): ValidationResult<CreateSongInput | UpdateSongInput> {
  const body = getBody(payload);
  const title = getOptionalString(body.title);
  const artist = getOptionalString(body.artist);
  const album = getOptionalString(body.album);
  const genre = getOptionalString(body.genre);
  const errors: ValidationErrors = {};

  const values = { title, artist, album, genre };
  const hasAtLeastOneField = Object.values(values).some(Boolean);

  if (mode === "create" || title !== undefined) {
    if (!title) {
      errors.title = "Title is required.";
    } else if (title.length < 2) {
      errors.title = "Title must be at least 2 characters long.";
    }
  }

  if (mode === "create" || artist !== undefined) {
    if (!artist) {
      errors.artist = "Artist is required.";
    } else if (artist.length < 2) {
      errors.artist = "Artist must be at least 2 characters long.";
    }
  }

  if (mode === "create" || album !== undefined) {
    if (!album) {
      errors.album = "Album is required.";
    } else if (album.length < 2) {
      errors.album = "Album must be at least 2 characters long.";
    }
  }

  if (mode === "create" || genre !== undefined) {
    if (!genre) {
      errors.genre = "Genre is required.";
    } else if (genre.length < 2) {
      errors.genre = "Genre must be at least 2 characters long.";
    }
  }

  if (mode === "update" && !hasAtLeastOneField) {
    errors.body = "At least one field is required for update.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  if (mode === "create") {
    return {
      success: true,
      data: {
        title: title as string,
        artist: artist as string,
        album: album as string,
        genre: genre as string,
      },
    };
  }

  return {
    success: true,
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(artist !== undefined ? { artist } : {}),
      ...(album !== undefined ? { album } : {}),
      ...(genre !== undefined ? { genre } : {}),
    },
  };
}

export function validateCreateSongInput(payload: unknown): ValidationResult<CreateSongInput> {
  return validateSongFields(payload, "create") as ValidationResult<CreateSongInput>;
}

export function validateUpdateSongInput(payload: unknown): ValidationResult<UpdateSongInput> {
  return validateSongFields(payload, "update") as ValidationResult<UpdateSongInput>;
}

export function validateSongListQuery(payload: unknown): ValidationResult<SongListQuery> {
  const query = getBody(payload);
  const page = getPositiveInteger(query.page, 1);
  const limit = getPositiveInteger(query.limit, 10);
  const search = getOptionalString(query.search);
  const artist = getOptionalString(query.artist);
  const album = getOptionalString(query.album);
  const genre = getOptionalString(query.genre);
  const sortByRaw = getString(query.sortBy) || "createdAt";
  const sortOrderRaw = getString(query.sortOrder).toLowerCase() || "desc";
  const errors: ValidationErrors = {};

  const allowedSortBy = new Set(["title", "artist", "album", "genre", "createdAt", "updatedAt"]);
  const allowedSortOrder = new Set(["asc", "desc"]);

  if (page === null) {
    errors.page = "Page must be a positive integer.";
  }

  if (limit === null) {
    errors.limit = "Limit must be a positive integer.";
  } else if (limit > 100) {
    errors.limit = "Limit cannot be greater than 100.";
  }

  if (!allowedSortBy.has(sortByRaw)) {
    errors.sortBy = "sortBy must be one of title, artist, album, genre, createdAt, updatedAt.";
  }

  if (!allowedSortOrder.has(sortOrderRaw)) {
    errors.sortOrder = "sortOrder must be either asc or desc.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      page: page as number,
      limit: limit as number,
      search,
      artist,
      album,
      genre,
      sortBy: sortByRaw as SongListQuery["sortBy"],
      sortOrder: sortOrderRaw as SongListQuery["sortOrder"],
    },
  };
}
