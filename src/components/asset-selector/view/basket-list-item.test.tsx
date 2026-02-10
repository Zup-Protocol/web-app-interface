import type { TokenBasket } from "@/core/types/token.types";
import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { setLocale } from "@/stores/i18n";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BasketListItem } from "./basket-list-item";

// Mock dependencies
vi.mock("framer-motion", () => ({
  m: {
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock("../../ui/animations/scale-hover-animation", () => ({
  ScaleHoverAnimation: ({ children }: any) => children,
}));

// Mock Tooltip components to avoid complexity
vi.mock("../../new-position/tooltips/basket-tooltip-content", () => ({
  BasketTooltipContent: () => <div data-testid="basket-tooltip" />,
}));

const mockBasket: TokenBasket = {
  type: "basket",
  id: "btc-pegged-tokens",
  name: "Test Basket",
  description: "A test basket with multiple tokens and networks",
  logoUrl: "https://example.com/logo.png",
  chainIds: [1, 8453],
  addresses: [],
  tokens: [
    {
      chainId: 1,
      address: "0x1",
      decimals: 18,
      name: "Token 1",
      symbol: "T1",
      logoUrl: "",
    },
    {
      chainId: 8453,
      address: "0x2",
      decimals: 18,
      name: "Token 2",
      symbol: "T2",
      logoUrl: "",
    },
    {
      chainId: 1,
      address: "0x3",
      decimals: 18,
      name: "Token 3",
      symbol: "T3",
      logoUrl: "",
    },
  ],
};

describe("BasketListItem i18n", () => {
  it("replaces {count} placeholder in all supported languages for tokens and networks", () => {
    const languages = AppLanguagesUtils.values.filter(
      (lang) => lang !== AppLanguages.SYSTEM,
    );

    languages.forEach((lang) => {
      setLocale({ locale: lang, persist: false });

      const { unmount } = render(
        <BasketListItem basket={mockBasket} onClick={() => {}} />,
      );

      // Subtitle should contain "3" (tokens) and "2" (networks)
      // We look for the text content to ensure placeholders are gone
      const subtitle = screen.getByText(
        (content) => content.includes("3") && content.includes("2"),
      );

      expect(subtitle).toBeInTheDocument();
      expect(subtitle.textContent).not.toContain("{count}");

      unmount();
    });
  });

  it("correctly handles singular network translation with {count}", () => {
    const singularBasket: TokenBasket = {
      ...mockBasket,
      chainIds: [1],
    };

    const languages = AppLanguagesUtils.values.filter(
      (lang) => lang !== AppLanguages.SYSTEM,
    );

    languages.forEach((lang) => {
      setLocale({ locale: lang, persist: false });

      const { unmount } = render(
        <BasketListItem basket={singularBasket} onClick={() => {}} />,
      );

      // Subtitle should contain "3" (tokens) and "1" (network)
      const subtitle = screen.getByText(
        (content) => content.includes("3") && content.includes("1"),
      );

      expect(subtitle).toBeInTheDocument();
      expect(subtitle.textContent).not.toContain("{count}");

      unmount();
    });
  });
});
