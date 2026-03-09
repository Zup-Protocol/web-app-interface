import { YieldPeriod } from "@/core/enums/yield-period";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PoolCard } from "./pool-card";

// Mock hooks
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

const mockTheme = vi.fn().mockReturnValue({ resolvedTheme: "dark" });
vi.mock("next-themes", () => ({
  useTheme: () => mockTheme(),
}));

const mockMediaQuery = vi.fn().mockReturnValue(true);
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: (query: string) => mockMediaQuery(query),
}));

const mockPool: any = {
  id: "pool-1",
  chainId: 1,
  protocol: { id: "pancakeswap-v3", name: "PancakeSwap V3" },
  tokens: [
    { symbol: "USDC", name: "USD Coin", logoUrl: "" },
    { symbol: "WETH", name: "Wrapped Ether", logoUrl: "" },
  ],
  stats: {
    stats24h: { yield: 15.5 },
    stats7d: { yield: 12.5 },
    stats30d: { yield: 10.5 },
    stats90d: { yield: 8.5 },
  },
  balance: {
    totalValueLockedUsd: 1250000,
  },
};

describe("PoolCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders basic info", () => {
    render(<PoolCard pool={mockPool} />);
    expect(screen.getByText(/USDC/i)).toBeDefined();
  });

  it("renders different periods", () => {
    const values = ["15", "12", "10", "8"];
    const periods = [YieldPeriod.Day, YieldPeriod.Week, YieldPeriod.Month, YieldPeriod.Quarter];

    periods.forEach((period, index) => {
      const { unmount } = render(<PoolCard pool={{ ...mockPool, id: `pool-${index}` }} yieldPeriod={period} />);
      expect(screen.getAllByText(new RegExp(values[index], "i")).length).toBeGreaterThan(0);
      unmount();
    });
  });

  it("handles interactions on mobile", () => {
    mockMediaQuery.mockReturnValue(false);
    render(<PoolCard pool={mockPool} />);
    const yieldText = screen.getAllByText(/15/)[0];
    fireEvent.click(yieldText);
    expect(screen.getAllByText(AppTranslationsKeys.POOL_CARD_N_YIELD.replace("{label}", "7d")).length).toBeGreaterThan(0);
  });

  it("calls onClickDeposit", () => {
    const onClick = vi.fn();
    render(<PoolCard pool={mockPool} onClickDeposit={onClick} />);
    fireEvent.click(screen.getByText(AppTranslationsKeys.POOL_CARD_DEPOSIT_BUTTON));
    expect(onClick).toHaveBeenCalled();
  });
});
