import type { SingleChainToken } from "@/core/types/token.types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TokenTooltipContent } from "./token-tooltip-content";

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

const mockSingleToken: SingleChainToken = {
  type: "single-chain",
  chainId: 1,
  symbol: "ETH",
  name: "Ethereum",
  logoUrl: "https://example.com/logo.png",
  address: "0x0000000000000000000000000000000000000000",
  decimals: 18,
};

describe("TokenTooltipContent", () => {
  it("renders both light and dark network logos with correct CSS classes", () => {
    render(<TokenTooltipContent token={mockSingleToken} />);

    // Check for network name (Ethereum is chainId 1)
    expect(screen.getByText("Ethereum")).toBeInTheDocument();

    // Check for images
    const images = screen.getAllByRole("img");
    // Should have 2 images: one with dark:hidden and one with hidden dark:block
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
