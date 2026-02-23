import type { TokenBasket } from "@/core/types/token.types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BasketTooltipContent } from "./basket-tooltip-content";

// Mock framer-motion
vi.mock("framer-motion", () => {
  const motionComponent = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  );
  return {
    motion: {
      a: motionComponent,
      div: motionComponent,
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock AssetTooltipContent
vi.mock("./asset-tooltip-content", () => ({
  AssetTooltipContent: ({ children, title }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

// Mock VirtualizedList as it needs parentRef and complex props
vi.mock("@/components/ui/virtualized-list", () => ({
  VirtualizedList: ({ items, renderItem }: any) => (
    <div>
      {items.map((item: any, index: number) => (
        <div key={index}>{renderItem(item, index, {})}</div>
      ))}
    </div>
  ),
}));

// Mock AssetLogo
vi.mock("@/components/ui/asset-logo", () => ({
  AssetLogo: () => <div data-testid="asset-logo" />,
}));

const mockBasket: TokenBasket = {
  type: "basket",
  id: "usd-stablecoins",
  name: "Test Basket",
  description: "A test basket",
  logoUrl: "https://example.com/basket.png",
  chainIds: [1],
  addresses: [
    { chainId: 1, address: "0x0000000000000000000000000000000000000000" },
  ],
  tokens: [
    {
      chainId: 1,
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      logoUrl: "https://example.com/eth.png",
      decimals: 18,
    },
  ],
};

describe("BasketTooltipContent", () => {
  it("renders both light and dark network logos with correct CSS classes for tokens", () => {
    render(<BasketTooltipContent basket={mockBasket} />);

    expect(screen.getByText("Test Basket")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();

    // Check for images
    const images = screen.getAllByRole("img");
    // Should have 2 network icons for the one token in the basket
    expect(images).toHaveLength(2);

    const lightLogo = images.find((img) =>
      img.className?.includes("dark:hidden"),
    );
    const darkLogo = images.find((img) =>
      img.className?.includes("dark:block"),
    );

    expect(lightLogo).toBeInTheDocument();
    expect(darkLogo).toBeInTheDocument();
    expect(darkLogo?.className).toContain("hidden");
  });
});
