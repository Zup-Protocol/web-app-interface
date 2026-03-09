"use client";

import { ThemeMode } from "@/lib/theme-mode";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimationProvider } from "./animation-provider";
import { HydricProvider } from "./hydric-provider";
import { ThemeProvider } from "./theme-provider";
import { Web3Provider } from "./web3-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HydricProvider>
        <ThemeProvider attribute="class" defaultTheme={ThemeMode.SYSTEM} enableSystem>
          <Web3Provider>
            <AnimationProvider>{children}</AnimationProvider>
          </Web3Provider>
        </ThemeProvider>
      </HydricProvider>
    </QueryClientProvider>
  );
}
