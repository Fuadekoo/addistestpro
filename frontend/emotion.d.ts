import "@emotion/react";
import type { AppTheme } from "@/lib/theme";

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
