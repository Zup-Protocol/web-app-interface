import type {
    MultiChainToken,
    SingleChainToken,
} from "@/core/types/token.types";
import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { setLocale } from "@/stores/i18n";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TokenListItem } from "./token-list-item";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => {
  const motionComponent = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  );
  return {
    m: {
      button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
          {children}
        </button>
      ),
      div: motionComponent,
      svg: motionComponent,
      path: motionComponent,
      circle: motionComponent,
      img: ({ src, alt, ...props }: any) => (
        <img src={src} alt={alt} {...props} />
      ),
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock ScaleHoverAnimation as it's not critical for this test
vi.mock("../../ui/animations/scale-hover-animation", () => ({
  ScaleHoverAnimation: ({ children }: any) => children,
}));

const mockSingleToken: SingleChainToken = {
  type: "single-chain",
  chainId: 1,
  symbol: "ETH",
  name: "Ethereum",
  logoUrl: "https://example.com/logo.png",
  address: "0x0000000000000000000000000000000000000000",
  decimals: 18,
};

const mockMultiToken: MultiChainToken = {
  type: "multi-chain",
  symbol: "USDC",
  name: "USD Coin",
  logoUrl: "https://example.com/logo.png",
  chainIds: [1, 8453],
  addresses: [
    { chainId: 1, address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
    { chainId: 8453, address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
  ],
};

describe("TokenListItem i18n", () => {
  it("replaces {count} placeholder in all supported languages for single-chain tokens", () => {
    const languages = AppLanguagesUtils.values.filter(
      (lang) => lang !== AppLanguages.SYSTEM,
    );

    languages.forEach((lang) => {
      setLocale({ locale: lang, persist: false });

      const { unmount } = render(
        <TokenListItem token={mockSingleToken} onClick={() => {}} />,
      );

      // Check description (subtitle) to ensure {count} is replaced
      const subtitle = screen.getByText(
        (content) =>
          content.includes(mockSingleToken.name) && content.includes("1"),
      );

      expect(subtitle).toBeInTheDocument();
      expect(subtitle.textContent).not.toContain("{count}");

      unmount();
    });
  });

  it("replaces {count} placeholder in all supported languages for multi-chain tokens", () => {
    const languages = AppLanguagesUtils.values.filter(
      (lang) => lang !== AppLanguages.SYSTEM,
    );

    languages.forEach((lang) => {
      setLocale({ locale: lang, persist: false });

      const { unmount } = render(
        <TokenListItem token={mockMultiToken} onClick={() => {}} />,
      );

      // Check description (subtitle) to ensure {count} is replaced with "2"
      const subtitle = screen.getByText(
        (content) =>
          content.includes(mockMultiToken.name) && content.includes("2"),
      );

      expect(subtitle).toBeInTheDocument();
      expect(subtitle.textContent).not.toContain("{count}");

      unmount();
    });
  });
});
