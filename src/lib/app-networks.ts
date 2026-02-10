import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import type { ImageMetadata } from "astro";
import {
    base,
    hyperEvm,
    mainnet,
    monad,
    plasma,
    scroll,
    unichain,
    type Chain,
} from "viem/chains";
import allNetworksIcon from "../assets/icons/all-networks.svg";
import baseLogoWhite from "../assets/logos/blockchains/base-white.svg";
import baseLogo from "../assets/logos/blockchains/base.svg";
import ethereumLogo from "../assets/logos/blockchains/ethereum.svg";
import hyperEvmLogoDarkGreen from "../assets/logos/blockchains/hyperevm-dark-green.svg";
import hyperEvmLogoMintGreen from "../assets/logos/blockchains/hyperevm-mint-green.svg";
import monadLogoWhite from "../assets/logos/blockchains/monad-white.svg";
import monadLogo from "../assets/logos/blockchains/monad.svg";
import plasmaLogoWhite from "../assets/logos/blockchains/plasma-white.svg";
import plasmaLogo from "../assets/logos/blockchains/plasma.svg";
import scrollLogo from "../assets/logos/blockchains/scroll.svg";
import unichainLogoWhite from "../assets/logos/blockchains/unichain-white.svg";
import unichainLogo from "../assets/logos/blockchains/unichain.svg";

export enum AppNetworks {
  ALL_NETWORKS,
  ETHEREUM,
  BASE,
  HYPER_EVM,
  UNICHAIN,
  SCROLL,
  PLASMA,
  MONAD,
}

export abstract class AppNetworksUtils {
  static values = Object.values(AppNetworks).filter(
    (v) => typeof v === "number",
  ) as AppNetworks[];

  static wagmiNetwork: Record<AppNetworks, Chain | undefined> = {
    [AppNetworks.ALL_NETWORKS]: undefined,
    [AppNetworks.ETHEREUM]: mainnet,
    [AppNetworks.BASE]: base,
    [AppNetworks.HYPER_EVM]: hyperEvm,
    [AppNetworks.UNICHAIN]: unichain,
    [AppNetworks.SCROLL]: scroll,
    [AppNetworks.PLASMA]: plasma,
    [AppNetworks.MONAD]: monad,
  };

  static logoSvg: Record<
    AppNetworks,
    { light: ImageMetadata | string; dark: ImageMetadata | string }
  > = {
    [AppNetworks.ALL_NETWORKS]: {
      light: allNetworksIcon,
      dark: allNetworksIcon,
    },
    [AppNetworks.ETHEREUM]: {
      light: ethereumLogo,
      dark: ethereumLogo,
    },
    [AppNetworks.BASE]: {
      light: baseLogo,
      dark: baseLogo,
    },
    [AppNetworks.HYPER_EVM]: {
      light: hyperEvmLogoDarkGreen,
      dark: hyperEvmLogoMintGreen,
    },
    [AppNetworks.UNICHAIN]: {
      light: unichainLogo,
      dark: unichainLogo,
    },
    [AppNetworks.SCROLL]: {
      light: scrollLogo,
      dark: scrollLogo,
    },
    [AppNetworks.PLASMA]: {
      light: plasmaLogo,
      dark: plasmaLogoWhite,
    },
    [AppNetworks.MONAD]: {
      light: monadLogo,
      dark: monadLogo,
    },
  };

  static logoOnBrandColor: Record<AppNetworks, ImageMetadata | string> = {
    [AppNetworks.ALL_NETWORKS]: allNetworksIcon,
    [AppNetworks.ETHEREUM]: ethereumLogo,
    [AppNetworks.BASE]: baseLogoWhite,
    [AppNetworks.HYPER_EVM]: hyperEvmLogoDarkGreen,
    [AppNetworks.UNICHAIN]: unichainLogoWhite,
    [AppNetworks.SCROLL]: scrollLogo,
    [AppNetworks.PLASMA]: plasmaLogoWhite,
    [AppNetworks.MONAD]: monadLogoWhite,
  };

  static textColorOnBrandColor: Record<AppNetworks, string> = {
    [AppNetworks.ALL_NETWORKS]: "#000000",
    [AppNetworks.ETHEREUM]: "#FFFFFF",
    [AppNetworks.BASE]: "#FFFFFF",
    [AppNetworks.HYPER_EVM]: "#072723",
    [AppNetworks.UNICHAIN]: "#FFFFFF",
    [AppNetworks.SCROLL]: "#000000",
    [AppNetworks.PLASMA]: "#FFFFFF",
    [AppNetworks.MONAD]: "#FFFFFF",
  };

  static networkName: Record<AppNetworks, string> = {
    [AppNetworks.ALL_NETWORKS]: "All Networks",
    [AppNetworks.ETHEREUM]: "Ethereum",
    [AppNetworks.BASE]: "Base",
    [AppNetworks.HYPER_EVM]: "HyperEVM",
    [AppNetworks.UNICHAIN]: "Unichain",
    [AppNetworks.SCROLL]: "Scroll",
    [AppNetworks.PLASMA]: "Plasma",
    [AppNetworks.MONAD]: "Monad",
  };

  static getTranslatedNetworkName(
    network: AppNetworks,
    translate: (key: AppTranslationsKeys) => string,
  ): string {
    if (network === AppNetworks.ALL_NETWORKS) {
      return translate(AppTranslationsKeys.NETWORKS_ALL);
    }

    return this.networkName[network];
  }

  static brandColor: Record<AppNetworks, string> = {
    [AppNetworks.ALL_NETWORKS]: "#FFFFFF",
    [AppNetworks.ETHEREUM]: "#343434",
    [AppNetworks.BASE]: "#0000FF",
    [AppNetworks.HYPER_EVM]: "#97FCE4",
    [AppNetworks.UNICHAIN]: "#F50DB4",
    [AppNetworks.SCROLL]: "#FFEEDA",
    [AppNetworks.PLASMA]: "#163029",
    [AppNetworks.MONAD]: "#6E54FF",
  };

  static explorerUrl: Record<AppNetworks, string> = {
    [AppNetworks.ALL_NETWORKS]: "",
    [AppNetworks.ETHEREUM]: "https://etherscan.io",
    [AppNetworks.BASE]: "https://basescan.org",
    [AppNetworks.HYPER_EVM]: "https://explorer.hyperevm.xyz",
    [AppNetworks.UNICHAIN]: "https://unichain.blockscout.com",
    [AppNetworks.SCROLL]: "https://scrollscan.com",
    [AppNetworks.PLASMA]: "https://explorer.plasma.org", // Placeholder
    [AppNetworks.MONAD]: "https://explorer.monad.xyz", // Placeholder
  };

  static getExplorerUrl(chainId: number): string {
    const network = this.values.find(
      (n) => this.wagmiNetwork[n]?.id === chainId,
    );
    if (!network) return "";
    return this.explorerUrl[network];
  }
}
