"use client";

import type { ChangeEvent } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Disc3Icon,
  EyeIcon,
  PencilLineIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
  WavesIcon,
} from "lucide-react";
import { SongFormDialog, type SongFormValues } from "@/components/songs/song-form-dialog";
import { Modal } from "@/components/system/modal";
import { Box, Grid } from "@/components/system/primitives";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  NativeSelect,
  NativeSelectOption,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableScroll,
} from "@/components/system/ui";
import { usePagination } from "@/hooks/use-pagination";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createSong,
  deleteSong,
  getSongs,
  updateSong,
} from "@/redux/song/songSlice";
import type { Song } from "@/redux/song/songTypes";

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

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  function handleGenreChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedGenre(event.target.value);
  }

  function handlePageSizeChange(event: ChangeEvent<HTMLSelectElement>) {
    setPageSize(Number(event.target.value));
  }

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
    <Box as="main" minHeight="100%" paddingX={[4, 6]} paddingY={[6, 7, 8]}>
      <Box margin="0 auto" maxWidth="1280px" width="100%">
        <Grid gap="24px">
          <Card tone="strong">
            <CardHeader
              display="flex"
              flexDirection={["column", "column", "row"]}
              alignItems={["flex-start", "flex-start", "flex-end"]}
              justifyContent="space-between"
              gap="16px"
            >
              <Box display="grid" gap="10px">
                <Badge tone="dark">Live library</Badge>
                <CardTitle as="h1" fontSize={[6, 7]}>
                  Real-Time Song Library Management
                </CardTitle>
                <CardDescription color="strongMuted" maxWidth="540px">
                  Create, update, and remove songs with instant synchronized table
                  refresh.
                </CardDescription>
              </Box>

              <Box display="flex" flexWrap="wrap" gap="12px">
                <Button
                  variant="ghost"
                  onClick={() => dispatch(getSongs())}
                  disabled={loading || saving}
                  css={{
                    backgroundColor: "rgba(255, 255, 255, 0.14)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#f8fafc",
                  }}
                >
                  {loading ? <Spinner size={16} /> : <RefreshCwIcon size={16} />}
                  Refresh
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCreateSong}
                  disabled={saving}
                  css={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    border: "none",
                  }}
                >
                  <PlusIcon size={16} />
                  Add song
                </Button>
              </Box>
            </CardHeader>
          </Card>

          <Grid gridTemplateColumns={["1fr", "1fr", "repeat(4, minmax(0, 1fr))"]} gap="16px">
            <Card tone="tint">
              <CardHeader>
                <CardDescription>Total songs</CardDescription>
                <CardTitle as="p" fontSize={7}>
                  {serverPagination?.totalSongs ?? songs.length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card tone="muted">
              <CardHeader>
                <CardDescription>Artists in catalog</CardDescription>
                <CardTitle as="p" fontSize={7}>
                  {totalArtists}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Albums tracked</CardDescription>
                <CardTitle as="p" fontSize={7}>
                  {totalAlbums}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card tone="strong">
              <CardHeader>
                <CardDescription color="strongMuted">Genres and sync</CardDescription>
                <CardTitle as="p" display="flex" alignItems="center" gap="10px" fontSize={5}>
                  <WavesIcon size={18} />
                  {totalGenres} genres
                </CardTitle>
                <CardDescription color="strongMuted">
                  Last updated {lastUpdated}
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>

          <Card>
            <CardHeader
              display="flex"
              flexDirection={["column", "column", "row"]}
              alignItems={["flex-start", "flex-start", "center"]}
              justifyContent="space-between"
              gap="16px"
            >
              <Box>
                <CardTitle as="h2">Song table</CardTitle>
                <CardDescription marginTop="8px">
                  Search locally, edit through dialogs, and remove records with
                  confirmation.
                </CardDescription>
              </Box>

              <Box
                display="grid"
                gap="12px"
                width="100%"
                maxWidth={["100%", "100%", "560px"]}
                gridTemplateColumns={["1fr", "1fr", "minmax(0, 1fr) 180px"]}
              >
                <Box position="relative">
                  <SearchIcon
                    size={16}
                    style={{
                      color: "#7b8698",
                      left: 16,
                      pointerEvents: "none",
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <Input
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search title, artist, album, or genre"
                    hasIcon
                  />
                </Box>

                <NativeSelect
                  value={selectedGenre}
                  onChange={handleGenreChange}
                >
                  <NativeSelectOption value="all">All genres</NativeSelectOption>
                  {genreOptions.map((genre) => (
                    <NativeSelectOption key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Box>
            </CardHeader>

            <CardContent>
              <Grid gap="20px">
                {error ? (
                  <Card tone="danger">
                    <CardContent padding="16px 18px">{error}</CardContent>
                  </Card>
                ) : null}

                <TableScroll>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead>Album</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead align="right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box
                              alignItems="center"
                              color="textMuted"
                              display="inline-flex"
                              gap="10px"
                              minHeight="180px"
                            >
                              <Spinner size={16} />
                              Loading songs...
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : filteredSongs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box
                              alignItems="center"
                              display="flex"
                              flexDirection="column"
                              gap="14px"
                              margin="0 auto"
                              maxWidth="360px"
                              paddingY="20px"
                              textAlign="center"
                            >
                              <Box
                                alignItems="center"
                                backgroundColor="surfaceTint"
                                borderRadius="pill"
                                color="text"
                                display="inline-flex"
                                height="52px"
                                justifyContent="center"
                                width="52px"
                              >
                                <Disc3Icon size={20} />
                              </Box>
                              <Box display="grid" gap="6px">
                                <Box as="p" fontWeight="semibold" margin={0}>
                                  {songs.length === 0
                                    ? "No songs yet"
                                    : "No songs match this search"}
                                </Box>
                                <Box as="p" color="textMuted" fontSize={1} margin={0}>
                                  {songs.length === 0
                                    ? "Create your first song and it will appear here immediately."
                                    : "Try a different keyword or clear the filter."}
                                </Box>
                              </Box>
                              {songs.length === 0 ? (
                                <Button onClick={handleCreateSong}>
                                  <PlusIcon size={16} />
                                  Add first song
                                </Button>
                              ) : null}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((song) => (
                          <TableRow key={song.id}>
                            <TableCell>
                              <Box as="p" fontWeight="semibold" margin={0}>
                                {song.title}
                              </Box>
                            </TableCell>
                            <TableCell>{song.artist}</TableCell>
                            <TableCell>{song.album}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{song.genre}</Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(song.updatedAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                display="flex"
                                flexWrap="wrap"
                                gap="8px"
                                justifyContent="flex-end"
                              >
                                <ButtonLink
                                  href={`/songs/${song.id}`}
                                  variant="ghost"
                                  size="sm"
                                  aria-label={`View details for ${song.title}`}
                                >
                                  <EyeIcon size={16} />
                                  View
                                </ButtonLink>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditSong(song)}
                                  disabled={saving || deletingId === song.id}
                                >
                                  <PencilLineIcon size={16} />
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setSongPendingDelete(song)}
                                  disabled={saving || deletingId === song.id}
                                >
                                  {deletingId === song.id ? (
                                    <Spinner size={16} />
                                  ) : (
                                    <Trash2Icon size={16} />
                                  )}
                                  Delete
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableScroll>

                <Box
                  borderTop="1px solid"
                  borderColor="line"
                  display="flex"
                  flexDirection={["column", "column", "row"]}
                  gap="16px"
                  justifyContent="space-between"
                  paddingTop="20px"
                >
                  <Box color="textMuted" fontSize={1}>
                    <Box as="p" margin={0}>
                      Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of{" "}
                      {totalItems} filtered songs
                    </Box>
                    {serverPagination?.totalSongs !== undefined &&
                    serverPagination.totalSongs !== totalItems ? (
                      <Box as="p" margin="6px 0 0">
                        {serverPagination.totalSongs} total songs in the library
                      </Box>
                    ) : null}
                  </Box>

                  <Box
                    alignItems={["stretch", "stretch", "center"]}
                    display="flex"
                    flexDirection={["column", "column", "row"]}
                    gap="12px"
                  >
                    <Box alignItems="center" display="flex" gap="10px">
                      <Box as="span" color="textMuted" fontSize={1}>
                        Rows per page
                      </Box>
                      <Box minWidth="92px">
                        <NativeSelect
                          sizeVariant="sm"
                          value={String(pageSize)}
                          onChange={handlePageSizeChange}
                        >
                          {pageSizeOptions.map((option) => (
                            <NativeSelectOption key={option} value={String(option)}>
                              {option}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </Box>
                    </Box>

                    {totalItems > 0 ? (
                      <Box alignItems="center" display="flex" flexWrap="wrap" gap="8px">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={!canGoPrevious}
                        >
                          Previous
                        </Button>

                        {paginationItems.map((item) =>
                          typeof item === "number" ? (
                            <Button
                              key={item}
                              variant={item === currentPage ? "primary" : "secondary"}
                              size="sm"
                              onClick={() => setPage(item)}
                            >
                              {item}
                            </Button>
                          ) : (
                            <Box
                              key={item}
                              alignItems="center"
                              color="textMuted"
                              display="inline-flex"
                              fontSize={1}
                              justifyContent="center"
                              minWidth="32px"
                            >
                              ...
                            </Box>
                          ),
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={!canGoNext}
                        >
                          Next
                        </Button>
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Box>

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

      <Modal
        open={!!songPendingDelete}
        onClose={() => setSongPendingDelete(null)}
        title="Delete this song?"
        description={
          songPendingDelete
            ? `Remove "${songPendingDelete.title}" by ${songPendingDelete.artist}. The table will refresh right after deletion.`
            : "This action cannot be undone."
        }
        maxWidth="520px"
        allowClose={deletingId === null}
        footer={(
          <>
            <Button
              variant="ghost"
              onClick={() => setSongPendingDelete(null)}
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSong}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? <Spinner size={16} /> : null}
              Delete song
            </Button>
          </>
        )}
      >
        <Box as="p" color="textMuted" lineHeight={1.7} margin={0}>
          This action removes the selected song from the library and cannot be
          undone.
        </Box>
      </Modal>
    </Box>
  );
}
