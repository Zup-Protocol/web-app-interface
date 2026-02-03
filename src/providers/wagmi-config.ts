import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";

export const REOWN_PROJECT_ID =
  import.meta.env.REOWN_PROJECT_ID || "PUNCH_PUNCH_PUNCH";

export const networks = [mainnet, sepolia];

export const wagmiAdapter = new WagmiAdapter({
  projectId: REOWN_PROJECT_ID,
  networks,
});

if (typeof window !== "undefined") {
  const getAppTheme = () =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";

  const origin = window.location.origin;

  const appKit = createAppKit({
    adapters: [wagmiAdapter],
    networks: networks as any,
    projectId: REOWN_PROJECT_ID,
    metadata: {
      name: "Zup Protocol",
      description: "Liquidity Pools made easy",
      url: origin,
      icons: [`${origin}/logomark.png`],
    },
    themeMode: getAppTheme(),
    themeVariables: {
      "--w3m-font-family": "SNPro, sans-serif",
      "--w3m-accent": "#7357FF",
      "--apkt-border-radius-master": "3px",
    },
  });

  const observer = new MutationObserver(() => {
    appKit.setThemeMode(getAppTheme());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

export const config = wagmiAdapter.wagmiConfig;
