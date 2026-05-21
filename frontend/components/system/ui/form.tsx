"use client";

import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { layout, space } from "styled-system";
import {
  arrowIcon,
  type InputBaseProps,
  type InputProps,
  type NativeSelectBaseProps,
  type NativeSelectProps,
} from "@/components/system/ui/shared";

const InputBase = styled("input")<InputBaseProps>(
  (({ theme, $hasIcon }: { theme: Theme; $hasIcon?: boolean }) => ({
    appearance: "none",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.line}`,
    borderRadius: theme.radii.md,
    color: theme.colors.text,
    minHeight: "48px",
    outline: "none",
    padding: $hasIcon ? "0 16px 0 44px" : "0 16px",
    transition:
      "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
    width: "100%",
    "::placeholder": {
      color: theme.colors.textSoft,
    },
    ":focus": {
      borderColor: theme.colors.primary,
      boxShadow: "0 0 0 4px rgba(36, 87, 255, 0.12)",
    },
    ":disabled": {
      backgroundColor: theme.colors.surfaceMuted,
      cursor: "not-allowed",
    },
  })) as any,
  space as any,
  layout as any,
);

export function Input({ hasIcon, ...props }: InputProps) {
  return <InputBase $hasIcon={hasIcon} {...props} />;
}

const NativeSelectBase = styled("select")<NativeSelectBaseProps>(
  (({
    theme,
    $sizeVariant = "md",
  }: {
    theme: Theme;
    $sizeVariant?: "sm" | "md";
  }) => ({
    appearance: "none",
    backgroundColor: theme.colors.surface,
    backgroundImage: `url("data:image/svg+xml,${arrowIcon}")`,
    backgroundPosition: "right 14px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "18px 18px",
    border: `1px solid ${theme.colors.line}`,
    borderRadius: theme.radii.md,
    color: theme.colors.text,
    cursor: "pointer",
    minHeight: $sizeVariant === "sm" ? "40px" : "48px",
    outline: "none",
    padding: $sizeVariant === "sm" ? "0 36px 0 12px" : "0 40px 0 16px",
    transition:
      "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
    width: "100%",
    ":focus": {
      borderColor: theme.colors.primary,
      boxShadow: "0 0 0 4px rgba(36, 87, 255, 0.12)",
    },
    ":disabled": {
      backgroundColor: theme.colors.surfaceMuted,
      cursor: "not-allowed",
    },
  })) as any,
  space as any,
  layout as any,
);

export function NativeSelect({ sizeVariant, ...props }: NativeSelectProps) {
  return <NativeSelectBase $sizeVariant={sizeVariant} {...props} />;
}

export const NativeSelectOption = "option";

export const Label = styled("label")(({ theme }: { theme: Theme }) => ({
  color: theme.colors.textMuted,
  display: "block",
  fontSize: "13px",
  fontWeight: theme.fontWeights.semibold,
  marginBottom: "8px",
}));

export const FieldError = styled("p")(({ theme }: { theme: Theme }) => ({
  color: theme.colors.dangerText,
  fontSize: "13px",
  margin: "8px 0 0",
}));
