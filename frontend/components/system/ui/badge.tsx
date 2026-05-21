"use client";

import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { layout, space } from "styled-system";
import { Box } from "@/components/system/primitives";
import { type BadgeProps, badgeToneStyles } from "@/components/system/ui/shared";

export const Badge = styled(Box)<BadgeProps>(
  (({
    theme,
    tone = "neutral",
    variant = "soft",
  }: {
    theme: Theme;
    tone?: BadgeProps["tone"];
    variant?: BadgeProps["variant"];
  }) => ({
    alignItems: "center",
    borderRadius: theme.radii.pill,
    display: "inline-flex",
    fontSize: "12px",
    fontWeight: theme.fontWeights.semibold,
    gap: "6px",
    letterSpacing: "0.02em",
    minHeight: "30px",
    padding: "0 12px",
    whiteSpace: "nowrap",
    ...badgeToneStyles[tone](theme, variant),
  })) as any,
  space as any,
  layout as any,
);
