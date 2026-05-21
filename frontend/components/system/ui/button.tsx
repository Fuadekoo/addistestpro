"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import type { Theme } from "@emotion/react";
import { layout, space } from "styled-system";
import {
  type ButtonElementProps,
  type ButtonLinkProps,
  type ButtonSize,
  type ButtonStyleProps,
  type ButtonVariant,
  buttonSizeStyles,
  buttonVariantStyles,
} from "@/components/system/ui/shared";

function buttonBase({
  theme,
  variant = "secondary",
  size = "md",
  fullWidth,
}: {
  theme: Theme;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}) {
  const variantStyles = buttonVariantStyles[variant](theme);
  const {
    hoverBackgroundColor,
    hoverColor,
    ...baseVariantStyles
  } = variantStyles;

  return {
    alignItems: "center",
    appearance: "none",
    borderRadius: theme.radii.md,
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: theme.fontWeights.semibold,
    gap: "10px",
    justifyContent: "center",
    transition:
      "background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease",
    width: fullWidth ? "100%" : "auto",
    textDecoration: "none",
    "&:hover:not(:disabled)": {
      transform: "translateY(-1px)",
      ...(hoverBackgroundColor ? { backgroundColor: hoverBackgroundColor } : {}),
      ...(hoverColor ? { color: hoverColor } : {}),
    },
    "&:focus-visible": {
      outline: "3px solid rgba(36, 87, 255, 0.24)",
      outlineOffset: "2px",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.56,
      transform: "none",
    },
    "& svg": {
      flexShrink: 0,
    },
    ...buttonSizeStyles[size],
    ...baseVariantStyles,
  };
}

const ButtonBase = styled("button")<ButtonStyleProps>(
  buttonBase as any,
  space as any,
  layout as any,
);

const ButtonLinkBase = styled("a")<ButtonStyleProps>(
  buttonBase as any,
  space as any,
  layout as any,
);

export function Button({ children, ...props }: ButtonElementProps) {
  return <ButtonBase {...props}>{children}</ButtonBase>;
}

export function ButtonLink({ children, ...props }: ButtonLinkProps) {
  return (
    <ButtonLinkBase as={Link as any} {...(props as any)}>
      {children}
    </ButtonLinkBase>
  );
}
