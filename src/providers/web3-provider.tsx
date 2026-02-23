"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { HydricProvider } from "./hydric-provider";
import { config, initializeAppKit } from "./wagmi-config";

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeAppKit();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <WagmiProvider config={config}>
      <HydricProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </HydricProvider>
    </WagmiProvider>
  );
}
