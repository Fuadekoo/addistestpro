"use client";

import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { Box } from "@/components/system/primitives";
import type { TableCellProps } from "@/components/system/ui/shared";

export const Divider = styled("hr")(({ theme }: { theme: Theme }) => ({
  border: "none",
  borderTop: `1px solid ${theme.colors.line}`,
  margin: 0,
}));

export const TableScroll = styled(Box)({
  overflowX: "auto",
  width: "100%",
});

export const Table = styled("table")({
  borderCollapse: "collapse",
  width: "100%",
});

export const TableHeader = styled("thead")({});

export const TableBody = styled("tbody")({});

export const TableRow = styled("tr")(({ theme }: { theme: Theme }) => ({
  borderBottom: `1px solid ${theme.colors.line}`,
  transition: "background-color 140ms ease",
  ":hover": {
    backgroundColor: "rgba(238, 244, 255, 0.45)",
  },
  ":last-of-type": {
    borderBottom: "none",
  },
}));

export const TableHead = styled("th")<TableCellProps>(({
  theme,
  align = "left",
}: {
  theme: Theme;
  align?: TableCellProps["align"];
}) => ({
  color: theme.colors.textMuted,
  fontSize: "12px",
  fontWeight: theme.fontWeights.semibold,
  letterSpacing: "0.06em",
  padding: "0 0 14px",
  textAlign: align,
  textTransform: "uppercase",
}));

export const TableCell = styled("td")<TableCellProps>(({ align = "left" }) => ({
  padding: "16px 0",
  textAlign: align,
  verticalAlign: "top",
}));
