import { AppNetworksUtils } from "@/lib/app-networks";
import { ThemeMode } from "@/lib/theme-mode";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";

const REOWN_PROJECT_ID = process.env.REOWN_PROJECT_ID || "";

const supportedNetworks = [
  Object.values(AppNetworksUtils.wagmiNetwork).filter(
    (value) => value !== undefined,
  ),
].flat();

export const wagmiAdapter = new WagmiAdapter({
  projectId: "5538068463f381cc4101c5e86e895c01",
  networks: supportedNetworks,
});

export const config = wagmiAdapter.wagmiConfig;

export function initializeAppKit() {
  if (typeof window === "undefined") return;

  const getAppTheme = () =>
    document.documentElement.classList.contains(ThemeMode.DARK)
      ? ThemeMode.DARK
      : ThemeMode.LIGHT;

  const origin = window.location.origin;

  const appKit = createAppKit({
    adapters: [wagmiAdapter],
    networks: supportedNetworks as any,
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

  return appKit;
}
