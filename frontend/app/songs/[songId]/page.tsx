import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarClockIcon,
  Disc3Icon,
  LibraryBigIcon,
  UserRoundIcon,
  WavesIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Box, Grid } from "@/components/system/primitives";
import { Badge } from "@/components/system/ui/badge";
import { ButtonLink } from "@/components/system/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/system/ui/card";
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

function DetailBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      backgroundColor="surfaceMuted"
      border="1px solid"
      borderColor="line"
      borderRadius="md"
      padding="16px"
    >
      <Box
        alignItems="center"
        color="textMuted"
        display="flex"
        fontSize={1}
        gap="8px"
        marginBottom="6px"
      >
        {icon}
        {label}
      </Box>
      <Box as="p" fontSize={4} fontWeight="semibold" margin={0}>
        {value}
      </Box>
    </Box>
  );
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
      <Box as="main" minHeight="100%" paddingX={[4, 6]} paddingY={[6, 7, 8]}>
        <Box margin="0 auto" maxWidth="880px" width="100%">
          <Grid gap="24px">
            <ButtonLink href="/songs" variant="outline" width="fit-content">
              <ArrowLeftIcon size={16} />
              Back to songs
            </ButtonLink>

            <Card>
              <CardHeader>
                <CardTitle as="h1">Song unavailable</CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
            </Card>
          </Grid>
        </Box>
      </Box>
    );
  }

  const { song } = result;

  return (
    <Box as="main" minHeight="100%" paddingX={[4, 6]} paddingY={[6, 7, 8]}>
      <Box margin="0 auto" maxWidth="1120px" width="100%">
        <Grid gap="24px">
          <Box
            alignItems={["flex-start", "flex-start", "center"]}
            display="flex"
            flexDirection={["column", "column", "row"]}
            gap="12px"
            justifyContent="space-between"
          >
            <ButtonLink href="/songs" variant="outline">
              <ArrowLeftIcon size={16} />
              Back to songs
            </ButtonLink>

            <Badge variant="outline" padding="0 14px">
              Song ID: {song.id}
            </Badge>
          </Box>

          <Card tone="strong">
            <CardHeader gap="16px">
              <Box alignItems="center" color="strongMuted" display="flex" gap="8px">
                <Disc3Icon size={16} />
                <span>Song details</span>
              </Box>
              <Box display="grid" gap="10px">
                <CardTitle as="h1" fontSize={[6, 7]}>
                  {song.title}
                </CardTitle>
                <CardDescription color="strongMuted" fontSize={3}>
                  {song.artist} / {song.album}
                </CardDescription>
              </Box>
              <Box display="flex" flexWrap="wrap" gap="10px">
                <Badge tone="dark">{song.genre}</Badge>
                <Badge tone="dark">Updated {format(new Date(song.updatedAt), "MMM d, yyyy")}</Badge>
              </Box>
            </CardHeader>
          </Card>

          <Grid gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]} gap="16px">
            <Card>
              <CardHeader>
                <CardTitle as="h2">Overview</CardTitle>
                <CardDescription>Core information for this track.</CardDescription>
              </CardHeader>
              <CardContent>
                <Grid gap="16px">
                  <DetailBlock
                    icon={<Disc3Icon size={16} />}
                    label="Title"
                    value={song.title}
                  />
                  <DetailBlock
                    icon={<UserRoundIcon size={16} />}
                    label="Artist"
                    value={song.artist}
                  />
                  <DetailBlock
                    icon={<LibraryBigIcon size={16} />}
                    label="Album"
                    value={song.album}
                  />
                  <DetailBlock
                    icon={<WavesIcon size={16} />}
                    label="Genre"
                    value={song.genre}
                  />
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle as="h2">Timeline</CardTitle>
                <CardDescription>
                  Creation and modification timestamps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Grid gap="16px">
                  <DetailBlock
                    icon={<CalendarClockIcon size={16} />}
                    label="Created at"
                    value={formatTimestamp(song.createdAt)}
                  />
                  <DetailBlock
                    icon={<CalendarClockIcon size={16} />}
                    label="Updated at"
                    value={formatTimestamp(song.updatedAt)}
                  />
                  <Box
                    backgroundColor="surfaceTint"
                    border="1px dashed"
                    borderColor="lineStrong"
                    borderRadius="md"
                    padding="16px"
                  >
                    <Box as="p" color="textMuted" fontSize={1} margin="0 0 6px">
                      Record id
                    </Box>
                    <Box
                      as="p"
                      fontFamily="mono"
                      fontSize={1}
                      lineHeight={1.7}
                      margin={0}
                      overflowWrap="anywhere"
                    >
                      {song.id}
                    </Box>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
