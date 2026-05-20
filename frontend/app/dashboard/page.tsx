"use client";

import { useEffect, useState } from "react";
import {
  AlbumIcon,
  BarChart3Icon,
  Disc3Icon,
  LibraryBigIcon,
  Loader2Icon,
  Music2Icon,
  RefreshCwIcon,
  Users2Icon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";
import { fetchSongStatisticsApi } from "@/redux/song/songApi";
import type { SongStatistics } from "@/redux/song/songTypes";

const genreChartConfig = {
  songCount: {
    label: "Songs",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load dashboard statistics right now.";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_36%),linear-gradient(to_bottom,rgba(248,250,252,0.96),rgba(255,255,255,1))] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="overflow-hidden border-0 bg-slate-950 text-slate-50 ring-1 ring-slate-900/10">
          <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/12 text-white hover:bg-white/12">
                Statistics dashboard
              </Badge>
              <CardTitle className="text-3xl tracking-tight">
                Song library totals and breakdowns
              </CardTitle>
              <CardDescription className="max-w-3xl text-slate-300">
                Overall totals, genre distribution, album inventory, and per-artist
                breakdowns from the aggregated backend statistics endpoint.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/songs">
                  <Music2Icon />
                  Open songs
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                onClick={() => void loadStatistics(true)}
                disabled={loading || refreshing}
              >
                <RefreshCwIcon className={refreshing ? "animate-spin" : undefined} />
                Refresh
              </Button>
            </div>
          </CardHeader>
        </Card>

        {error ? (
          <Card className="border border-destructive/20 bg-destructive/5 text-destructive shadow-none">
            <CardHeader>
              <CardTitle>Dashboard error</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {loading && !stats ? (
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardContent className="flex min-h-64 items-center justify-center">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                Loading dashboard statistics...
              </span>
            </CardContent>
          </Card>
        ) : null}

        {stats ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="bg-linear-to-br from-white to-slate-50">
                <CardHeader>
                  <CardDescription>Total songs</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    <Disc3Icon className="size-6 text-slate-500" />
                    {stats.totalSongs}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-linear-to-br from-white to-stone-50">
                <CardHeader>
                  <CardDescription>Total artists</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    <Users2Icon className="size-6 text-slate-500" />
                    {stats.totalArtists}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-linear-to-br from-white to-zinc-50">
                <CardHeader>
                  <CardDescription>Total albums</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    <AlbumIcon className="size-6 text-slate-500" />
                    {stats.totalAlbums}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-linear-to-br from-slate-950 to-slate-800 text-slate-50 ring-1 ring-slate-900/10">
                <CardHeader>
                  <CardDescription className="text-slate-300">Total genres</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    <WavesIcon className="size-6" />
                    {stats.totalGenres}
                  </CardTitle>
                </CardHeader>
              </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
              <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3Icon className="size-5" />
                    Songs per genre
                  </CardTitle>
                  <CardDescription>
                    Top genre distribution from the current library.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={genreChartConfig} className="h-80 w-full">
                    <BarChart accessibilityLayer data={genreData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="genre"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => String(value).slice(0, 10)}
                      />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Bar
                        dataKey="songCount"
                        fill="var(--color-songCount)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
                <CardHeader>
                  <CardTitle>Genre table</CardTitle>
                  <CardDescription>
                    Exact counts for every genre in the database.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Genre</TableHead>
                          <TableHead className="text-right">Songs</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.songsPerGenre.map((item) => (
                          <TableRow key={item.genre}>
                            <TableCell>{item.genre}</TableCell>
                            <TableCell className="text-right font-medium">
                              {item.songCount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
                <CardHeader>
                  <CardTitle>Artist overview</CardTitle>
                  <CardDescription>
                    Songs and album counts grouped by artist.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Artist</TableHead>
                          <TableHead className="text-right">Songs</TableHead>
                          <TableHead className="text-right">Albums</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.songsPerArtist.map((artist) => (
                          <TableRow key={artist.artist}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{artist.artist}</p>
                                <p className="text-xs text-muted-foreground">
                                  {artist.albums.join(", ")}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {artist.songCount}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {artist.albumCount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
                <CardHeader>
                  <CardTitle>Album inventory</CardTitle>
                  <CardDescription>
                    Song counts for each album and its owning artist.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Album</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead className="text-right">Songs</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.songsPerAlbum.map((album) => (
                          <TableRow key={`${album.artist}-${album.album}`}>
                            <TableCell className="font-medium">{album.album}</TableCell>
                            <TableCell>{album.artist}</TableCell>
                            <TableCell className="text-right font-medium">
                              {album.songCount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4">
              <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
                <CardHeader>
                  <CardTitle>Artist to album breakdown</CardTitle>
                  <CardDescription>
                    Nested summary of how many songs each artist has inside each album.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {stats.artistAlbumBreakdown.map((artist) => (
                    <Card key={artist.artist} className="border bg-slate-50 py-0 ring-0">
                      <CardHeader className="py-4">
                        <CardTitle className="text-lg">{artist.artist}</CardTitle>
                        <CardDescription>
                          {artist.songCount} songs across {artist.albumCount} albums
                        </CardDescription>
                      </CardHeader>
                      <Separator />
                      <CardContent className="space-y-3 py-4">
                        {artist.albums.map((album) => (
                          <div
                            key={`${artist.artist}-${album.album}`}
                            className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"
                          >
                            <div>
                              <p className="font-medium">{album.album}</p>
                              <p className="text-xs text-muted-foreground">Album total</p>
                            </div>
                            <Badge variant="outline">{album.songCount} songs</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
