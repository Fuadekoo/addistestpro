"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/redux/store";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={store}>
        {children}
        <Toaster position="top-right" richColors />
      </Provider>
    </ThemeProvider>
  );
}
