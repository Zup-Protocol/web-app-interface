"use client";

import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { initializeAppKit, config as wagmiConfig } from "./wagmi-config";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeAppKit();
    setReady(true);
  }, []);

  if (!ready) return null;

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}
