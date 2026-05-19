import { z, type ZodError, type ZodType } from "zod";

type ValidationErrors = Record<string, string>;

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationErrors };

const sortByValues = [
  "title",
  "artist",
  "album",
  "genre",
  "createdAt",
  "updatedAt",
] as const;

const sortOrderValues = ["asc", "desc"] as const;

const requiredSongField = (fieldName: string) =>
  z
    .string({
      error: `${fieldName} is required.`,
    })
    .trim()
    .min(1, `${fieldName} is required.`)
    .min(2, `${fieldName} must be at least 2 characters long.`);

const optionalSongField = (fieldName: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const normalizedValue = value.trim();
      return normalizedValue ? normalizedValue : undefined;
    },
    z
      .string()
      .min(2, `${fieldName} must be at least 2 characters long.`)
      .optional(),
  );

const createSongSchema = z.object({
  title: requiredSongField("Title"),
  artist: requiredSongField("Artist"),
  album: requiredSongField("Album"),
  genre: requiredSongField("Genre"),
});

const updateSongSchema = z
  .object({
    title: optionalSongField("Title"),
    artist: optionalSongField("Artist"),
    album: optionalSongField("Album"),
    genre: optionalSongField("Genre"),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error: "At least one field is required for update.",
    path: ["body"],
  });

const songListQuerySchema = z.object({
  page: z.preprocess(
    (value) => (value === undefined || value === null || value === "" ? 1 : value),
    z.coerce.number().int("Page must be a positive integer.").positive("Page must be a positive integer."),
  ),
  limit: z.preprocess(
    (value) => (value === undefined || value === null || value === "" ? 10 : value),
    z.coerce
      .number()
      .int("Limit must be a positive integer.")
      .positive("Limit must be a positive integer.")
      .max(100, "Limit cannot be greater than 100."),
  ),
  search: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const normalizedValue = value.trim();
      return normalizedValue ? normalizedValue : undefined;
    },
    z.string().optional(),
  ),
  artist: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const normalizedValue = value.trim();
      return normalizedValue ? normalizedValue : undefined;
    },
    z.string().optional(),
  ),
  album: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const normalizedValue = value.trim();
      return normalizedValue ? normalizedValue : undefined;
    },
    z.string().optional(),
  ),
  genre: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const normalizedValue = value.trim();
      return normalizedValue ? normalizedValue : undefined;
    },
    z.string().optional(),
  ),
  sortBy: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value === undefined || value === null || value === "" ? "createdAt" : value;
      }

      const normalizedValue = value.trim();
      return normalizedValue || "createdAt";
    },
    z.enum(sortByValues, {
      error: "sortBy must be one of title, artist, album, genre, createdAt, updatedAt.",
    }),
  ),
  sortOrder: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value === undefined || value === null || value === "" ? "desc" : value;
      }

      const normalizedValue = value.trim().toLowerCase();
      return normalizedValue || "desc";
    },
    z.enum(sortOrderValues, {
      error: "sortOrder must be either asc or desc.",
    }),
  ),
});

function formatValidationErrors(error: ZodError): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "body";

    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return errors;
}

function validateWithSchema<T>(schema: ZodType<T>, payload: unknown): ValidationResult<T> {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: formatValidationErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
export type SongListQuery = z.infer<typeof songListQuerySchema>;

export function validateCreateSongInput(payload: unknown): ValidationResult<CreateSongInput> {
  return validateWithSchema(createSongSchema, payload);
}

export function validateUpdateSongInput(payload: unknown): ValidationResult<UpdateSongInput> {
  return validateWithSchema(updateSongSchema, payload);
}

export function validateSongListQuery(payload: unknown): ValidationResult<SongListQuery> {
  return validateWithSchema(songListQuerySchema, payload);
}
