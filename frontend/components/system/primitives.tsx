"use client";
"use client";

import styled from "@emotion/styled";
import type { ComponentPropsWithoutRef } from "react";
import {
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography,
  type BorderProps,
  type ColorProps,
  type FlexboxProps,
  type GridProps,
  type LayoutProps,
  type PositionProps,
  type ShadowProps,
  type SpaceProps,
  type TypographyProps,
} from "styled-system";

export type SystemProps = {
  [key: string]: unknown;
} & SpaceProps &
  LayoutProps &
  ColorProps &
  TypographyProps &
  FlexboxProps &
  BorderProps &
  ShadowProps &
  PositionProps &
  GridProps;

type BoxProps = ComponentPropsWithoutRef<"div"> & SystemProps;

const system = compose(
  space,
  layout,
  color,
  typography,
  flexbox,
  border,
  shadow,
  position,
  grid,
);

export const Box = styled("div")<BoxProps>(system as any);

export const Flex = styled(Box)({
  display: "flex",
});

export const Grid = styled(Box)({
  display: "grid",
});
