import { css, type Theme } from "@emotion/react";

export const theme = {
  breakpoints: ["40em", "52em", "72em"],
  space: [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80] as const,
  fontSizes: [12, 14, 16, 18, 20, 24, 30, 36, 48] as const,
  fonts: {
    body: "var(--font-geist-sans), 'Segoe UI', sans-serif",
    mono: "var(--font-geist-mono), 'SFMono-Regular', monospace",
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  radii: {
    sm: "12px",
    md: "18px",
    lg: "24px",
    xl: "32px",
    pill: "999px",
  },
  shadows: {
    card: "0 18px 44px rgba(15, 23, 42, 0.08)",
    soft: "0 8px 24px rgba(15, 23, 42, 0.06)",
    glow: "0 22px 60px rgba(36, 87, 255, 0.18)",
  },
  colors: {
    canvas: "#f3f6fb",
    canvasAlt: "#eef3fb",
    surface: "#ffffff",
    surfaceMuted: "#f8fafc",
    surfaceTint: "#eef4ff",
    surfaceStrong: "#0f172a",
    text: "#0f172a",
    textMuted: "#5b6474",
    textSoft: "#7b8698",
    line: "#d9e0eb",
    lineStrong: "#c4cedd",
    primary: "#2457ff",
    primaryHover: "#1848e0",
    primaryTint: "#eaf0ff",
    primaryText: "#ffffff",
    accent: "#0f766e",
    accentTint: "#def7f3",
    accentText: "#0f4f48",
    danger: "#dc2626",
    dangerTint: "#fef0f0",
    dangerText: "#b91c1c",
    strongText: "#f8fafc",
    strongMuted: "rgba(248, 250, 252, 0.74)",
  },
} as const;

export type AppTheme = typeof theme;

export const globalStyles = (appTheme: Theme) => css({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  html: {
    minHeight: "100%",
  },
  body: {
    minHeight: "100%",
    margin: 0,
    fontFamily: appTheme.fonts.body,
    color: appTheme.colors.text,
    backgroundColor: appTheme.colors.canvas,
    backgroundImage: [
      "radial-gradient(circle at top, rgba(36, 87, 255, 0.08), transparent 34%)",
      "linear-gradient(180deg, #f3f6fb 0%, #ffffff 46%, #eef3fb 100%)",
    ].join(", "),
    backgroundAttachment: "fixed",
  },
  a: {
    color: "inherit",
    textDecoration: "none",
  },
  button: {
    font: "inherit",
  },
  input: {
    font: "inherit",
  },
  select: {
    font: "inherit",
  },
  textarea: {
    font: "inherit",
  },
  "::selection": {
    backgroundColor: appTheme.colors.primary,
    color: appTheme.colors.primaryText,
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});
