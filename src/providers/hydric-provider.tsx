"use client";

import { HydricGateway } from "@hydric/gateway";
import { createContext, useContext, useEffect, useState } from "react";

const HydricContext = createContext<HydricGateway | null>(undefined as any);

export function HydricProvider({ children }: { children: React.ReactNode }) {
  const [gateway, setGateway] = useState<HydricGateway | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.PUBLIC_HYDRIC_API_KEY;

    if (!apiKey) {
      console.warn("Hydric API key not found");
      return;
    }

    setGateway(
      new HydricGateway({
        apiKey,
      }),
    );
  }, []);

  return (
    <HydricContext.Provider value={gateway}>{children}</HydricContext.Provider>
  );
}

export function useHydric() {
  const context = useContext(HydricContext);

  if (context === undefined) {
    throw new Error("useHydric must be used within a HydricProvider");
  }

  return context;
}
