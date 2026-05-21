import type { Theme } from "@emotion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import type { SystemProps } from "@/components/system/primitives";

export type Tone = "default" | "muted" | "strong" | "tint" | "danger";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "soft" | "outline";
export type BadgeTone = "neutral" | "dark" | "primary" | "danger";

export type CardProps = SystemProps & {
  tone?: Tone;
};

export type ButtonStyleProps = SystemProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export type BadgeProps = SystemProps & {
  variant?: BadgeVariant;
  tone?: BadgeTone;
};

export type InputProps = ComponentPropsWithoutRef<"input"> &
  SystemProps & {
    hasIcon?: boolean;
  };

export type NativeSelectProps = ComponentPropsWithoutRef<"select"> &
  SystemProps & {
    sizeVariant?: "sm" | "md";
  };

export type InputBaseProps = Omit<InputProps, "hasIcon"> & {
  $hasIcon?: boolean;
};

export type NativeSelectBaseProps = Omit<NativeSelectProps, "sizeVariant"> & {
  $sizeVariant?: "sm" | "md";
};

export type TableCellProps = SystemProps & {
  align?: "left" | "center" | "right";
};

export type ButtonElementProps = ComponentPropsWithoutRef<"button"> & ButtonStyleProps;
export type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> &
  ButtonStyleProps & {
    children?: ReactNode;
  };

export const surfaceStyles = {
  default: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.line}`,
    boxShadow: theme.shadows.card,
  }),
  muted: (theme: Theme) => ({
    backgroundColor: theme.colors.surfaceMuted,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.line}`,
    boxShadow: theme.shadows.soft,
  }),
  strong: (theme: Theme) => ({
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(20, 33, 61, 1) 64%, rgba(36, 87, 255, 0.92) 100%)",
    color: theme.colors.strongText,
    border: "none",
    boxShadow: theme.shadows.glow,
  }),
  tint: (theme: Theme) => ({
    background:
      "linear-gradient(180deg, rgba(238, 244, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
    color: theme.colors.text,
    border: `1px solid ${theme.colors.line}`,
    boxShadow: theme.shadows.soft,
  }),
  danger: (theme: Theme) => ({
    backgroundColor: theme.colors.dangerTint,
    color: theme.colors.dangerText,
    border: `1px solid rgba(220, 38, 38, 0.18)`,
    boxShadow: "none",
  }),
} as const;

export const buttonVariantStyles = {
  primary: (theme: Theme) => ({
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryText,
    border: "none",
    hoverBackgroundColor: theme.colors.primaryHover,
    hoverColor: undefined,
  }),
  secondary: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.line}`,
    boxShadow: theme.shadows.soft,
    hoverBackgroundColor: theme.colors.surfaceMuted,
    hoverColor: undefined,
  }),
  outline: (theme: Theme) => ({
    backgroundColor: "transparent",
    color: theme.colors.text,
    border: `1px solid ${theme.colors.lineStrong}`,
    hoverBackgroundColor: theme.colors.surfaceMuted,
    hoverColor: undefined,
  }),
  ghost: (theme: Theme) => ({
    backgroundColor: "transparent",
    color: theme.colors.textMuted,
    border: "none",
    hoverBackgroundColor: theme.colors.surfaceMuted,
    hoverColor: theme.colors.text,
  }),
  danger: (theme: Theme) => ({
    backgroundColor: theme.colors.danger,
    color: theme.colors.primaryText,
    border: "none",
    hoverBackgroundColor: "#b91c1c",
    hoverColor: undefined,
  }),
} as const;

export const buttonSizeStyles = {
  sm: {
    minHeight: "40px",
    padding: "0 14px",
    fontSize: "14px",
  },
  md: {
    minHeight: "46px",
    padding: "0 18px",
    fontSize: "15px",
  },
  lg: {
    minHeight: "52px",
    padding: "0 22px",
    fontSize: "16px",
  },
} as const;

export const badgeToneStyles = {
  neutral: (theme: Theme, variant: BadgeVariant) =>
    variant === "outline"
      ? {
          color: theme.colors.textMuted,
          border: `1px solid ${theme.colors.lineStrong}`,
          backgroundColor: "transparent",
        }
      : {
          color: theme.colors.text,
          backgroundColor: theme.colors.surfaceTint,
          border: "none",
        },
  dark: (theme: Theme, variant: BadgeVariant) =>
    variant === "outline"
      ? {
          color: theme.colors.strongText,
          border: "1px solid rgba(248, 250, 252, 0.22)",
          backgroundColor: "transparent",
        }
      : {
          color: theme.colors.strongText,
          backgroundColor: "rgba(255, 255, 255, 0.14)",
          border: "none",
        },
  primary: (theme: Theme, variant: BadgeVariant) =>
    variant === "outline"
      ? {
          color: theme.colors.primary,
          border: `1px solid rgba(36, 87, 255, 0.25)`,
          backgroundColor: "transparent",
        }
      : {
          color: theme.colors.primary,
          backgroundColor: theme.colors.primaryTint,
          border: "none",
        },
  danger: (theme: Theme, variant: BadgeVariant) =>
    variant === "outline"
      ? {
          color: theme.colors.dangerText,
          border: `1px solid rgba(220, 38, 38, 0.2)`,
          backgroundColor: "transparent",
        }
      : {
          color: theme.colors.dangerText,
          backgroundColor: theme.colors.dangerTint,
          border: "none",
        },
} as const;

export const arrowIcon = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><path d='M5.5 7.5 10 12l4.5-4.5' stroke='%235b6474' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>",
);
