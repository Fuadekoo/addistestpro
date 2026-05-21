"use client";

import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { layout, space } from "styled-system";
import { Box } from "@/components/system/primitives";
import { type CardProps, surfaceStyles } from "@/components/system/ui/shared";

export const Card = styled(Box)<CardProps>(
  (({ theme, tone = "default" }: { theme: Theme; tone?: CardProps["tone"] }) => ({
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...surfaceStyles[tone](theme),
  })) as any,
  space as any,
  layout as any,
);

export const CardHeader = styled(Box)({
  display: "grid",
  gap: "12px",
  padding: "24px",
});

export const CardContent = styled(Box)({
  padding: "24px",
});

export const CardTitle = styled(Box)({
  margin: 0,
  fontSize: "1.25rem",
  fontWeight: 700,
  letterSpacing: "-0.03em",
});

export const CardDescription = styled(Box)(({ theme }: { theme: Theme }) => ({
  margin: 0,
  color: theme.colors.textMuted,
  lineHeight: 1.6,
}));
