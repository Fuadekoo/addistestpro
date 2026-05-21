"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Grid } from "@/components/system/primitives";
import { Modal } from "@/components/system/modal";
import { Button, FieldError, Input, Label, Spinner } from "@/components/system/ui";
import type { Song, SongPayload } from "@/redux/song/songTypes";

const songFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters long."),
  artist: z.string().trim().min(2, "Artist must be at least 2 characters long."),
  album: z.string().trim().min(2, "Album must be at least 2 characters long."),
  genre: z.string().trim().min(2, "Genre must be at least 2 characters long."),
});

export type SongFormValues = z.infer<typeof songFormSchema>;

type SongFormDialogProps = {
  open: boolean;
  song: Song | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SongPayload) => void;
};

const emptyValues: SongFormValues = {
  title: "",
  artist: "",
  album: "",
  genre: "",
};

function getSongFormValues(song: Song | null): SongFormValues {
  if (!song) {
    return emptyValues;
  }

  return {
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
  };
}

export function SongFormDialog({
  open,
  song,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: SongFormDialogProps) {
  const form = useForm<SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(getSongFormValues(song));
  }, [form, open, song]);

  const errors = form.formState.errors;
  const isEditing = !!song;

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? "Edit song" : "Add a new song"}
      description={
        isEditing
          ? "Update the track details and the table will refresh automatically."
          : "Create a song entry with clean validation before it reaches the API."
      }
      maxWidth="720px"
      footer={(
        <>
          <Button
            variant="ghost"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="song-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size={16} /> : null}
            {isEditing ? "Save changes" : "Create song"}
          </Button>
        </>
      )}
    >
      <form id="song-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Grid gridTemplateColumns={["1fr", "1fr 1fr"]} gap="16px">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Blinding Lights"
              aria-invalid={!!errors.title}
              disabled={isSubmitting}
              {...form.register("title")}
            />
            {errors.title ? <FieldError>{errors.title.message}</FieldError> : null}
          </div>

          <div>
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              placeholder="The Weeknd"
              aria-invalid={!!errors.artist}
              disabled={isSubmitting}
              {...form.register("artist")}
            />
            {errors.artist ? <FieldError>{errors.artist.message}</FieldError> : null}
          </div>

          <div>
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              placeholder="After Hours"
              aria-invalid={!!errors.album}
              disabled={isSubmitting}
              {...form.register("album")}
            />
            {errors.album ? <FieldError>{errors.album.message}</FieldError> : null}
          </div>

          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              placeholder="Synth-pop"
              aria-invalid={!!errors.genre}
              disabled={isSubmitting}
              {...form.register("genre")}
            />
            {errors.genre ? <FieldError>{errors.genre.message}</FieldError> : null}
          </div>
        </Grid>
      </form>
    </Modal>
  );
}
