"use client";

import { ThemeMode } from "@/lib/theme-mode";
import { AnimationProvider } from "./animation-provider";
import { ThemeProvider } from "./theme-provider";
import { Web3Provider } from "./web3-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={ThemeMode.SYSTEM}
      enableSystem
    >
      <Web3Provider>
        <AnimationProvider>{children}</AnimationProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}
