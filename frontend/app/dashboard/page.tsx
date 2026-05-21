"use client";

import { useEffect, useState } from "react";
import {
  AlbumIcon,
  BarChart3Icon,
  Disc3Icon,
  RefreshCwIcon,
  Users2Icon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableScroll,
} from "@/components/system/ui";
import { theme } from "@/lib/theme";
import { useAppSelector } from "@/redux/hooks";
import { fetchSongStatisticsApi } from "@/redux/song/songApi";
import type { SongStatistics } from "@/redux/song/songTypes";

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load dashboard statistics right now.";
}

function GenreTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <Box
      backgroundColor="surface"
      border="1px solid"
      borderColor="line"
      borderRadius="md"
      boxShadow="card"
      padding="12px 14px"
    >
      <Box as="p" color="textMuted" fontSize={0} margin={0}>
        {label}
      </Box>
      <Box as="p" fontSize={2} fontWeight="semibold" margin="4px 0 0">
        {payload[0]?.value ?? 0} songs
      </Box>
    </Box>
  );
}

export default function DashboardPage() {
  const lastMutation = useAppSelector((state) => state.song.lastMutation);
  const [stats, setStats] = useState<SongStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadStatistics(showSpinner = false): Promise<void> {
    if (showSpinner) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetchSongStatisticsApi();
      setStats(response.stats);
      setError(null);
    } catch (requestError) {
      setError(formatErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadStatistics();
  }, []);

  useEffect(() => {
    if (!lastMutation) {
      return;
    }

    void loadStatistics(true);
  }, [lastMutation]);

  const genreData = stats?.songsPerGenre.slice(0, 8) ?? [];

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
                <Badge tone="dark">Statistics dashboard</Badge>
                <CardTitle as="h1" fontSize={[6, 7]}>
                  Song library totals and breakdowns
                </CardTitle>
                <CardDescription color="strongMuted" maxWidth="720px">
                  Overall totals, genre distribution, album inventory, and
                  per-artist breakdowns from the aggregated backend statistics
                  endpoint.
                </CardDescription>
              </Box>

              <Box display="flex" flexWrap="wrap" gap="12px">
                <ButtonLink
                  href="/songs"
                  variant="ghost"
                  css={{
                    backgroundColor: "rgba(255, 255, 255, 0.14)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#f8fafc",
                  }}
                >
                  Open songs
                </ButtonLink>
                <Button
                  variant="ghost"
                  onClick={() => void loadStatistics(true)}
                  disabled={loading || refreshing}
                  css={{
                    backgroundColor: "rgba(255, 255, 255, 0.14)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#f8fafc",
                  }}
                >
                  {refreshing ? <Spinner size={16} /> : <RefreshCwIcon size={16} />}
                  Refresh
                </Button>
              </Box>
            </CardHeader>
          </Card>

          {error ? (
            <Card tone="danger">
              <CardHeader>
                <CardTitle as="h2">Dashboard error</CardTitle>
                <CardDescription color="dangerText">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {loading && !stats ? (
            <Card>
              <CardContent
                alignItems="center"
                display="flex"
                justifyContent="center"
                minHeight="256px"
              >
                <Box alignItems="center" color="textMuted" display="inline-flex" gap="10px">
                  <Spinner size={16} />
                  Loading dashboard statistics...
                </Box>
              </CardContent>
            </Card>
          ) : null}

          {stats ? (
            <>
              <Grid gridTemplateColumns={["1fr", "1fr", "repeat(4, minmax(0, 1fr))"]} gap="16px">
                <Card tone="tint">
                  <CardHeader>
                    <CardDescription>Total songs</CardDescription>
                    <CardTitle
                      as="p"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      fontSize={7}
                    >
                      <Disc3Icon color={theme.colors.textSoft} size={24} />
                      {stats.totalSongs}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card tone="muted">
                  <CardHeader>
                    <CardDescription>Total artists</CardDescription>
                    <CardTitle
                      as="p"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      fontSize={7}
                    >
                      <Users2Icon color={theme.colors.textSoft} size={24} />
                      {stats.totalArtists}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardDescription>Total albums</CardDescription>
                    <CardTitle
                      as="p"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      fontSize={7}
                    >
                      <AlbumIcon color={theme.colors.textSoft} size={24} />
                      {stats.totalAlbums}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card tone="strong">
                  <CardHeader>
                    <CardDescription color="strongMuted">Total genres</CardDescription>
                    <CardTitle
                      as="p"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      fontSize={7}
                    >
                      <WavesIcon size={24} />
                      {stats.totalGenres}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Grid>

              <Grid gridTemplateColumns={["1fr", "1fr", "1.3fr 0.9fr"]} gap="16px">
                <Card>
                  <CardHeader>
                    <CardTitle as="h2" display="flex" alignItems="center" gap="10px">
                      <BarChart3Icon size={18} />
                      Songs per genre
                    </CardTitle>
                    <CardDescription>
                      Top genre distribution from the current library.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Box height="320px" width="100%">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={genreData}>
                          <CartesianGrid stroke={theme.colors.line} vertical={false} />
                          <XAxis
                            dataKey="genre"
                            axisLine={false}
                            tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
                            tickFormatter={(value) => String(value).slice(0, 10)}
                            tickLine={false}
                            tickMargin={10}
                          />
                          <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
                            tickLine={false}
                          />
                          <Tooltip cursor={{ fill: "rgba(36, 87, 255, 0.08)" }} content={<GenreTooltip />} />
                          <Bar
                            dataKey="songCount"
                            fill={theme.colors.primary}
                            radius={[10, 10, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle as="h2">Genre table</CardTitle>
                    <CardDescription>
                      Exact counts for every genre in the database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Box maxHeight="320px" overflowY="auto" paddingRight="8px">
                      <TableScroll>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Genre</TableHead>
                              <TableHead align="right">Songs</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stats.songsPerGenre.map((item) => (
                              <TableRow key={item.genre}>
                                <TableCell>{item.genre}</TableCell>
                                <TableCell align="right">
                                  <Box as="span" fontWeight="semibold">
                                    {item.songCount}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableScroll>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]} gap="16px">
                <Card>
                  <CardHeader>
                    <CardTitle as="h2">Artist overview</CardTitle>
                    <CardDescription>
                      Songs and album counts grouped by artist.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Box maxHeight="384px" overflowY="auto" paddingRight="8px">
                      <TableScroll>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Artist</TableHead>
                              <TableHead align="right">Songs</TableHead>
                              <TableHead align="right">Albums</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stats.songsPerArtist.map((artist) => (
                              <TableRow key={artist.artist}>
                                <TableCell>
                                  <Box display="grid" gap="4px">
                                    <Box as="p" fontWeight="semibold" margin={0}>
                                      {artist.artist}
                                    </Box>
                                    <Box as="p" color="textMuted" fontSize={0} margin={0}>
                                      {artist.albums.join(", ")}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Box as="span" fontWeight="semibold">
                                    {artist.songCount}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Box as="span" fontWeight="semibold">
                                    {artist.albumCount}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableScroll>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle as="h2">Album inventory</CardTitle>
                    <CardDescription>
                      Song counts for each album and its owning artist.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Box maxHeight="384px" overflowY="auto" paddingRight="8px">
                      <TableScroll>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Album</TableHead>
                              <TableHead>Artist</TableHead>
                              <TableHead align="right">Songs</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stats.songsPerAlbum.map((album) => (
                              <TableRow key={`${album.artist}-${album.album}`}>
                                <TableCell>
                                  <Box as="span" fontWeight="semibold">
                                    {album.album}
                                  </Box>
                                </TableCell>
                                <TableCell>{album.artist}</TableCell>
                                <TableCell align="right">
                                  <Box as="span" fontWeight="semibold">
                                    {album.songCount}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableScroll>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Card>
                <CardHeader>
                  <CardTitle as="h2">Artist to album breakdown</CardTitle>
                  <CardDescription>
                    Nested summary of how many songs each artist has inside each
                    album.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Grid gridTemplateColumns={["1fr", "repeat(2, minmax(0, 1fr))", "repeat(3, minmax(0, 1fr))"]} gap="16px">
                    {stats.artistAlbumBreakdown.map((artist) => (
                      <Card key={artist.artist} tone="muted">
                        <CardHeader paddingBottom="16px">
                          <CardTitle as="h3" fontSize={4}>
                            {artist.artist}
                          </CardTitle>
                          <CardDescription>
                            {artist.songCount} songs across {artist.albumCount} albums
                          </CardDescription>
                        </CardHeader>
                        <Divider />
                        <CardContent display="grid" gap="12px" paddingTop="16px">
                          {artist.albums.map((album) => (
                            <Box
                              key={`${artist.artist}-${album.album}`}
                              alignItems="center"
                              backgroundColor="surface"
                              border="1px solid"
                              borderColor="line"
                              borderRadius="md"
                              display="flex"
                              justifyContent="space-between"
                              padding="14px 16px"
                            >
                              <Box>
                                <Box as="p" fontWeight="semibold" margin={0}>
                                  {album.album}
                                </Box>
                                <Box as="p" color="textMuted" fontSize={0} margin="4px 0 0">
                                  Album total
                                </Box>
                              </Box>
                              <Badge variant="outline">{album.songCount} songs</Badge>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </>
          ) : null}
        </Grid>
      </Box>
    </Box>
  );
}
