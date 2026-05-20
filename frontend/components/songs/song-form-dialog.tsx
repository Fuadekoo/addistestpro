"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{isEditing ? "Edit song" : "Add a new song"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the track details and the table will refresh automatically."
                : "Create a song entry with clean validation before it reaches the API."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <FieldContent>
                <Input
                  id="title"
                  placeholder="Blinding Lights"
                  aria-invalid={!!errors.title}
                  disabled={isSubmitting}
                  {...form.register("title")}
                />
                <FieldError errors={errors.title ? [errors.title] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="artist">Artist</FieldLabel>
              <FieldContent>
                <Input
                  id="artist"
                  placeholder="The Weeknd"
                  aria-invalid={!!errors.artist}
                  disabled={isSubmitting}
                  {...form.register("artist")}
                />
                <FieldError errors={errors.artist ? [errors.artist] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="album">Album</FieldLabel>
              <FieldContent>
                <Input
                  id="album"
                  placeholder="After Hours"
                  aria-invalid={!!errors.album}
                  disabled={isSubmitting}
                  {...form.register("album")}
                />
                <FieldError errors={errors.album ? [errors.album] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="genre">Genre</FieldLabel>
              <FieldContent>
                <Input
                  id="genre"
                  placeholder="Synth-pop"
                  aria-invalid={!!errors.genre}
                  disabled={isSubmitting}
                  {...form.register("genre")}
                />
                <FieldError errors={errors.genre ? [errors.genre] : undefined} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter className="rounded-b-xl" showCloseButton>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Create song"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
