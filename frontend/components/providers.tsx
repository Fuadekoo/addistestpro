"use client";

import type { ReactNode } from "react";
import { Global, ThemeProvider } from "@emotion/react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { EmotionRegistry } from "@/components/providers/emotion-registry";
import { globalStyles, theme } from "@/lib/theme";
import { store } from "@/redux/store";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <Provider store={store}>
          {children}
          <Toaster
            position="top-right"
            richColors
            theme="light"
            toastOptions={{
              style: {
                borderRadius: theme.radii.md,
                border: `1px solid ${theme.colors.line}`,
                boxShadow: theme.shadows.card,
              },
            }}
          />
        </Provider>
      </ThemeProvider>
    </EmotionRegistry>
  );
}
