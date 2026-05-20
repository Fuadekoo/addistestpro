"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Disc3Icon,
  EyeIcon,
  Loader2Icon,
  PencilLineIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import { SongFormDialog, type SongFormValues } from "@/components/songs/song-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createSong,
  deleteSong,
  getSongs,
  updateSong,
} from "@/redux/song/songSlice";
import type { Song } from "@/redux/song/songTypes";

const statCardClasses = [
  "bg-linear-to-br from-white to-slate-50",
  "bg-linear-to-br from-white to-stone-50",
  "bg-linear-to-br from-white to-zinc-50",
];

export default function SongsPage() {
  const dispatch = useAppDispatch();
  const {
    songs,
    pagination: serverPagination,
    loading,
    saving,
    deletingId,
    error,
    lastMutation,
  } = useAppSelector((state) => state.song);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [songPendingDelete, setSongPendingDelete] = useState<Song | null>(null);

  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const genreOptions = useMemo(
    () =>
      Array.from(new Set(songs.map((song) => song.genre.trim())))
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right)),
    [songs],
  );
  const filteredSongs = songs.filter((song) => {
    const matchesGenre =
      selectedGenre === "all" || song.genre.toLowerCase() === selectedGenre;

    if (!matchesGenre) {
      return false;
    }

    if (!deferredSearch) {
      return true;
    }

    return [song.title, song.artist, song.album, song.genre].some((value) =>
      value.toLowerCase().includes(deferredSearch),
    );
  });
  const {
    currentPage,
    pageSize,
    pageSizeOptions,
    totalPages,
    paginatedData,
    setPage,
    setPageSize,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination(filteredSongs, {
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  });

  const totalArtists = new Set(songs.map((song) => song.artist.toLowerCase())).size;
  const totalAlbums = new Set(songs.map((song) => song.album.toLowerCase())).size;
  const totalGenres = new Set(songs.map((song) => song.genre.toLowerCase())).size;
  const lastUpdated = songs[0]?.updatedAt
    ? format(new Date(songs[0].updatedAt), "MMM d, yyyy 'at' h:mm a")
    : "No recent updates";
  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "end-ellipsis", totalPages] as const;
    }

    if (currentPage >= totalPages - 2) {
      return [1, "start-ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    }

    return [
      1,
      "start-ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "end-ellipsis",
      totalPages,
    ] as const;
  }, [currentPage, totalPages]);

  useEffect(() => {
    dispatch(getSongs());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, selectedGenre, setPage]);

  useEffect(() => {
    if (!lastMutation) {
      return;
    }

    setIsFormOpen(false);
    setEditingSong(null);
    setSongPendingDelete(null);
  }, [lastMutation]);

  function handleCreateSong() {
    setEditingSong(null);
    setIsFormOpen(true);
  }

  function handleEditSong(song: Song) {
    setEditingSong(song);
    setIsFormOpen(true);
  }

  function handleFormSubmit(values: SongFormValues) {
    if (editingSong) {
      dispatch(
        updateSong({
          id: editingSong.id,
          data: values,
        }),
      );
      return;
    }

    dispatch(createSong(values));
  }

  function handleDeleteSong() {
    if (!songPendingDelete) {
      return;
    }

    dispatch(deleteSong(songPendingDelete.id));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_38%),linear-gradient(to_bottom,rgba(248,250,252,0.96),rgba(255,255,255,1))] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="overflow-hidden border-0 bg-slate-950 text-slate-50 ring-1 ring-slate-900/10">
          <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/12 text-white hover:bg-white/12">
                Live library
              </Badge>
              <CardTitle className="text-3xl tracking-tight">
                Real-Time Song Library Management
              </CardTitle>
              <CardDescription className="max-w-2xl text-slate-300">
                Create, update, and remove songs with instant synchronized table refresh.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                onClick={() => dispatch(getSongs())}
                disabled={loading || saving}
              >
                <RefreshCwIcon className={loading ? "animate-spin" : undefined} />
                Refresh
              </Button>
              <Button
                className="bg-white text-slate-950 hover:bg-slate-100"
                onClick={handleCreateSong}
                disabled={saving}
              >
                <PlusIcon />
                Add song
              </Button>
            </div>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <Card className={statCardClasses[0]}>
            <CardHeader>
              <CardDescription>Total songs</CardDescription>
              <CardTitle className="text-3xl">
                {serverPagination?.totalSongs ?? songs.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className={statCardClasses[1]}>
            <CardHeader>
              <CardDescription>Artists in catalog</CardDescription>
              <CardTitle className="text-3xl">{totalArtists}</CardTitle>
            </CardHeader>
          </Card>

          <Card className={statCardClasses[2]}>
            <CardHeader>
              <CardDescription>Albums tracked</CardDescription>
              <CardTitle className="text-3xl">{totalAlbums}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-linear-to-br from-slate-950 to-slate-800 text-slate-50 ring-1 ring-slate-900/10">
            <CardHeader>
              <CardDescription className="text-slate-300">Genres and sync</CardDescription>
              <CardTitle className="flex items-center gap-2 text-lg">
                <WavesIcon />
                {totalGenres} genres
              </CardTitle>
              <CardDescription className="text-slate-300">
                Last updated {lastUpdated}
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Song table</CardTitle>
              <CardDescription>
                Search locally, edit inline through dialogs, and remove records with
                confirmation.
              </CardDescription>
            </div>

            <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row sm:justify-end">
              <div className="relative w-full sm:max-w-sm">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, artist, album, or genre"
                  className="pl-9"
                />
              </div>

              <NativeSelect
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
                className="w-full sm:w-44"
              >
                <NativeSelectOption value="all">All genres</NativeSelectOption>
                {genreOptions.map((genre) => (
                  <NativeSelectOption
                    key={genre}
                    value={genre.toLowerCase()}
                  >
                    {genre}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Loader2Icon className="size-4 animate-spin" />
                        Loading songs...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredSongs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                          <Disc3Icon className="size-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {songs.length === 0
                              ? "No songs yet"
                              : "No songs match this search"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {songs.length === 0
                              ? "Create your first song and it will appear here immediately."
                              : "Try a different keyword or clear the filter."}
                          </p>
                        </div>
                        {songs.length === 0 ? (
                          <Button onClick={handleCreateSong}>
                            <PlusIcon />
                            Add first song
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell className="font-medium">{song.title}</TableCell>
                      <TableCell>{song.artist}</TableCell>
                      <TableCell>{song.album}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{song.genre}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(song.updatedAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/songs/${song.id}`} aria-label={`View details for ${song.title}`}>
                              <EyeIcon />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSong(song)}
                            disabled={saving || deletingId === song.id}
                          >
                            <PencilLineIcon />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSongPendingDelete(song)}
                            disabled={saving || deletingId === song.id}
                          >
                            {deletingId === song.id ? (
                              <Loader2Icon className="animate-spin" />
                            ) : (
                              <Trash2Icon />
                            )}
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of{" "}
                  {totalItems} filtered songs
                </p>
                {serverPagination?.totalSongs !== undefined &&
                serverPagination.totalSongs !== totalItems ? (
                  <p>{serverPagination.totalSongs} total songs in the library</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Rows per page</span>
                  <NativeSelect
                    size="sm"
                    value={String(pageSize)}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                  >
                    {pageSizeOptions.map((option) => (
                      <NativeSelectOption key={option} value={String(option)}>
                        {option}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>

                {totalItems > 0 ? (
                  <Pagination className="mx-0 w-auto justify-start">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            goToPreviousPage();
                          }}
                          className={!canGoPrevious ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {paginationItems.map((item) => (
                        <PaginationItem key={String(item)}>
                          {typeof item === "number" ? (
                            <PaginationLink
                              href="#"
                              isActive={item === currentPage}
                              onClick={(event) => {
                                event.preventDefault();
                                setPage(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          ) : (
                            <PaginationEllipsis />
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            goToNextPage();
                          }}
                          className={!canGoNext ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SongFormDialog
        open={isFormOpen}
        song={editingSong}
        isSubmitting={saving}
        onOpenChange={(open) => {
          setIsFormOpen(open);

          if (!open) {
            setEditingSong(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog
        open={!!songPendingDelete}
        onOpenChange={(open) => {
          if (!open) {
            setSongPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this song?</AlertDialogTitle>
            <AlertDialogDescription>
              {songPendingDelete
                ? `Remove "${songPendingDelete.title}" by ${songPendingDelete.artist}. The table will refresh right after deletion.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteSong}
              disabled={deletingId !== null}
            >
              Delete song
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
