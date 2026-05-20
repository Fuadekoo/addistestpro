import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarClockIcon,
  Disc3Icon,
  LibraryBigIcon,
  UserRoundIcon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Song } from "@/redux/song/songTypes";

export const dynamic = "force-dynamic";

type SongDetailPageProps = {
  params: Promise<{
    songId: string;
  }>;
};

type SongResponse = {
  success: boolean;
  message: string;
  song?: Song;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function getSong(songId: string): Promise<SongResponse> {
  try {
    const response = await fetch(`${BASE_URL}/songs/${songId}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      notFound();
    }

    const data = (await response.json()) as SongResponse;

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Unable to load this song.",
      };
    }

    return data;
  } catch {
    return {
      success: false,
      message: "Unable to load this song right now.",
    };
  }
}

function formatTimestamp(value: string): string {
  return format(new Date(value), "MMMM d, yyyy 'at' h:mm a");
}

export default async function SongDetailPage({
  params,
}: SongDetailPageProps) {
  const { songId } = await params;

  if (!songId?.trim()) {
    notFound();
  }

  const result = await getSong(songId);

  if (!result.success || !result.song) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_36%),linear-gradient(to_bottom,rgba(248,250,252,0.96),rgba(255,255,255,1))] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <Button asChild variant="outline" className="w-fit">
            <Link href="/songs">
              <ArrowLeftIcon />
              Back to songs
            </Link>
          </Button>

          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader>
              <CardTitle>Song unavailable</CardTitle>
              <CardDescription>{result.message}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  const { song } = result;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_36%),linear-gradient(to_bottom,rgba(248,250,252,0.96),rgba(255,255,255,1))] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="outline">
            <Link href="/songs">
              <ArrowLeftIcon />
              Back to songs
            </Link>
          </Button>

          <Badge variant="outline" className="px-3 py-1">
            Song ID: {song.id}
          </Badge>
        </div>

        <Card className="overflow-hidden border-0 bg-slate-950 text-slate-50 ring-1 ring-slate-900/10">
          <CardHeader className="gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Disc3Icon className="size-4" />
              <span className="text-sm">Song details</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight">{song.title}</CardTitle>
              <CardDescription className="text-base text-slate-300">
                {song.artist} • {song.album}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/12 text-white hover:bg-white/12">
                {song.genre}
              </Badge>
              <Badge className="bg-white/12 text-white hover:bg-white/12">
                Updated {format(new Date(song.updatedAt), "MMM d, yyyy")}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Core information for this track.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Disc3Icon className="size-4" />
                  Title
                </div>
                <p className="text-lg font-semibold">{song.title}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRoundIcon className="size-4" />
                  Artist
                </div>
                <p className="text-lg font-semibold">{song.artist}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <LibraryBigIcon className="size-4" />
                  Album
                </div>
                <p className="text-lg font-semibold">{song.album}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <WavesIcon className="size-4" />
                  Genre
                </div>
                <p className="text-lg font-semibold">{song.genre}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Creation and modification timestamps.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClockIcon className="size-4" />
                  Created at
                </div>
                <p className="font-medium">{formatTimestamp(song.createdAt)}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClockIcon className="size-4" />
                  Updated at
                </div>
                <p className="font-medium">{formatTimestamp(song.updatedAt)}</p>
              </div>

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="mb-1 text-sm text-muted-foreground">Record id</div>
                <p className="break-all font-mono text-sm">{song.id}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
