import type { ImageMetadata } from "astro";

import aerodromeLogo from "@/assets/logos/dexs/aerodrome.svg";
import alienbaseLogo from "@/assets/logos/dexs/alienbase.svg";
import atlantisLogo from "@/assets/logos/dexs/atlantis.svg";
import capricornLogo from "@/assets/logos/dexs/capricorn.svg";
import hybraLogo from "@/assets/logos/dexs/hybra.svg";
import hyperswapLogo from "@/assets/logos/dexs/hyperswap.svg";
import kittenswapLogo from "@/assets/logos/dexs/kittenswap.svg";
import octoswapLogo from "@/assets/logos/dexs/octoswap.svg";
import okuLogo from "@/assets/logos/dexs/oku.svg";
import pancakeswapLogo from "@/assets/logos/dexs/pancakeswap.svg";
import projectxLogo from "@/assets/logos/dexs/projectx.svg";
import ramsesLogo from "@/assets/logos/dexs/ramses.svg";
import scrollDexLogo from "@/assets/logos/dexs/scroll-dex.svg";
import sushiSwapLogo from "@/assets/logos/dexs/sushi-swap.svg";
import ultrasolidLogo from "@/assets/logos/dexs/ultrasolid.svg";
import uniswapLogo from "@/assets/logos/dexs/uniswap.svg";
import upheavalLogo from "@/assets/logos/dexs/upheaval.svg";
import velodromeLogo from "@/assets/logos/dexs/velodrome.svg";

export interface DexMetadata {
  name: string;
  url: string;
  logo: ImageMetadata;
  logoBackgroundColor: string;
  textColorOnBackground: string;
}

export enum SupportedDexs {
  UNISWAP_V2 = "uniswap-v2",
  AERODROME_V3 = "aerodrome-v3",
  ALIENBASE_V3 = "alienbase-v3",
  SCROLL_DEX = "honeypop-v3",
  OKU_TRADE_V3 = "oku-trade-v3",
  PANCAKE_SWAP_V3 = "pancakeswap-v3",
  SUSHI_SWAP_V3 = "sushi-swap-v3",
  UNISWAP_V3 = "uniswap-v3",
  VELODROME_V3 = "velodrome-v3",
  PANCAKESWAP_INFINITY_CL = "pancakeswap-infinity-cl",
  UNISWAP_V4 = "uniswap-v4",
  HYPER_SWAP_V3 = "hyperswap-v3",
  PROJECT_X_V3 = "projectx-v3",
  HYBRA_V3 = "hybra-v3",
  HYBRA_SLIPSTREAM = "hybra-slipstream",
  KITTENSWAP_ALGEBRA = "kittenswap-v3",
  ULTRASOLID_V3 = "ultrasolid-v3",
  UPHEAVAL_V3 = "upheaval-v3",
  ATLANTIS_ALGEBRA = "atlantis-algebra",
  RAMSES_V3 = "ramses-v3",
  OCTOSWAP_CL = "octoswap-cl",
  CAPRICORN_CL = "capricorn-cl",
}

export abstract class SupportedDexsUtils {
  static count = Object.keys(SupportedDexs).length;

  static metadata: Record<SupportedDexs, DexMetadata> = {
    [SupportedDexs.UNISWAP_V2]: {
      name: "Uniswap V2",
      url: "https://uniswap.org/",
      logo: uniswapLogo,
      logoBackgroundColor: "#FFFAFE",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.AERODROME_V3]: {
      name: "Aerodrome Slipstream",
      url: "https://aerodrome.finance/",
      logo: aerodromeLogo,
      logoBackgroundColor: "#EBE8E1",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.ALIENBASE_V3]: {
      name: "Alien Base V3",
      url: "https://app.alienbase.xyz/",
      logo: alienbaseLogo,
      logoBackgroundColor: "#084EFC",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.SCROLL_DEX]: {
      name: "Scroll DEX",
      url: "https://swap.scroll.io/",
      logo: scrollDexLogo,
      logoBackgroundColor: "#FFEEDA",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.OKU_TRADE_V3]: {
      name: "Oku V3",
      url: "https://oku.trade/",
      logo: okuLogo,
      logoBackgroundColor: "#232221",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.PANCAKE_SWAP_V3]: {
      name: "PancakeSwap V3",
      url: "https://pancakeswap.finance/",
      logo: pancakeswapLogo,
      logoBackgroundColor: "#3BD3E0",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.SUSHI_SWAP_V3]: {
      name: "SushiSwap V3",
      url: "https://app.sushi.com/",
      logo: sushiSwapLogo,
      logoBackgroundColor: "#FFFFFF",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.UNISWAP_V3]: {
      name: "Uniswap V3",
      url: "https://uniswap.org/",
      logo: uniswapLogo,
      logoBackgroundColor: "#FFFAFE",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.VELODROME_V3]: {
      name: "Velodrome Slipstream",
      url: "https://velodrome.finance/",
      logo: velodromeLogo,
      logoBackgroundColor: "#FFFFFF",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.PANCAKESWAP_INFINITY_CL]: {
      name: "PancakeSwap Infinity CL",
      url: "https://pancakeswap.finance/",
      logo: pancakeswapLogo,
      logoBackgroundColor: "#3BD3E0",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.UNISWAP_V4]: {
      name: "Uniswap V4",
      url: "https://uniswap.org/",
      logo: uniswapLogo,
      logoBackgroundColor: "#FFFAFE",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.HYPER_SWAP_V3]: {
      name: "HyperSwap V3",
      url: "https://hyperswap.exchange/",
      logo: hyperswapLogo,
      logoBackgroundColor: "#01FF2B",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.PROJECT_X_V3]: {
      name: "Project X V3",
      url: "https://prjx.com/",
      logo: projectxLogo,
      logoBackgroundColor: "#FFFFFF",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.HYBRA_V3]: {
      name: "Hybra V3",
      url: "https://hybra.finance/",
      logo: hybraLogo,
      logoBackgroundColor: "#022D33",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.KITTENSWAP_ALGEBRA]: {
      name: "Kittenswap Algebra",
      url: "https://kittenswap.finance/",
      logo: kittenswapLogo,
      logoBackgroundColor: "#1B3B36",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.ULTRASOLID_V3]: {
      name: "UltraSolid V3",
      url: "https://ultrasolid.xyz/",
      logo: ultrasolidLogo,
      logoBackgroundColor: "#FF91BE",
      textColorOnBackground: "#000000",
    },

    [SupportedDexs.UPHEAVAL_V3]: {
      name: "Upheaval V3",
      url: "https://upheaval.fi/",
      logo: upheavalLogo,
      logoBackgroundColor: "#000000",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.ATLANTIS_ALGEBRA]: {
      name: "Atlantis Algebra",
      url: "https://atlantisdex.xyz/",
      logo: atlantisLogo,
      logoBackgroundColor: "#1F0252",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.RAMSES_V3]: {
      name: "Ramses V3",
      url: "https://ramses.xyz/",
      logo: ramsesLogo,
      logoBackgroundColor: "#082723",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.HYBRA_SLIPSTREAM]: {
      name: "Hybra Slipstream",
      url: "https://hybra.finance/",
      logo: hybraLogo,
      logoBackgroundColor: "#022D33",
      textColorOnBackground: "#FFFFFF",
    },

    [SupportedDexs.OCTOSWAP_CL]: {
      name: "Octoswap CL",
      url: "https://octo.exchange/",
      logo: octoswapLogo,
      logoBackgroundColor: "#5038E5",
      textColorOnBackground: "#FFFFFF",
    },
    [SupportedDexs.CAPRICORN_CL]: {
      name: "Capricorn CL",
      url: "https://www.capricorn.exchange/",
      logo: capricornLogo,
      logoBackgroundColor: "#101417",
      textColorOnBackground: "#FFFFFF",
    },
  };
}
