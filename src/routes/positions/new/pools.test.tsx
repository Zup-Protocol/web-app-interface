import { YieldPeriod } from "@/core/enums/yield-period";
import { usePoolsSearch } from "@/hooks/pools/use-pools-search";
import { LocalStorage } from "@/lib/utils/local-storage-service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PoolsSearchScreen, Route } from "./pools";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({
    useSearch: vi.fn(),
    useNavigate: vi.fn(),
  }),
}));

// Mock hooks
vi.mock("@/hooks/pools/use-pools-search", () => ({
  usePoolsSearch: vi.fn(),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

vi.mock("@/lib/utils/local-storage-service", () => ({
  LocalStorage: {
    getSearchSettings: vi.fn(),
  },
}));

// Mock component parts that avoid heavy rendering if needed
vi.mock("@/components/pools/pools-carousel", () => ({
  PoolsCarousel: ({ pools, isLoading, isError }: any) => (
    <div data-testid="pools-carousel">{isLoading ? "Loading..." : isError && pools.length === 0 ? "Error State" : `Pools: ${pools?.length || 0}`}</div>
  ),
}));

describe("PoolsSearchScreen", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

  const mockNavigate = vi.fn();
  const mockSearch = { assetA: "hash1", assetB: "hash2", chainId: 1 };

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    vi.mocked(Route.useSearch).mockReturnValue(mockSearch);
    // @ts-ignore
    vi.mocked(Route.useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(LocalStorage.getSearchSettings).mockReturnValue({
      minLiquidity: "5000",
      blockedExchanges: [],
    });

    vi.mocked(usePoolsSearch).mockReturnValue({
      data: {
        pages: [
          {
            pools: Array(5).fill({ id: "1" }),
            filters: { minimumTotalValueLockedUsd: 5000 },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    } as any);
  });

  it("renders correctly with search params", () => {
    render(<PoolsSearchScreen />, { wrapper });
    expect(screen.getByText(/pools.list.title/i)).toBeDefined();
    expect(screen.getByTestId("pools-carousel")).toBeDefined();
    expect(screen.getByText(/Pools: 5/)).toBeDefined();
  });

  it("handles back navigation", () => {
    render(<PoolsSearchScreen />, { wrapper });
    const backBtn = screen.getByText(/pools.list.backButton/i);
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("handles period change", () => {
    render(<PoolsSearchScreen />, { wrapper });
    const weekBtn = screen.getByText(/7d/i);
    fireEvent.click(weekBtn);

    expect(usePoolsSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        activePeriod: YieldPeriod.Week,
      }),
    );
  });

  it("toggles liquidity filter override", () => {
    render(<PoolsSearchScreen />, { wrapper });
    const filterBtn = screen.getByText(/pools.list.filter.searchAll/i);
    fireEvent.click(filterBtn);

    expect(usePoolsSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        minLiquidityOverride: 0,
      }),
    );

    // Toggle back
    vi.mocked(usePoolsSearch).mockReturnValue({
      data: {
        pages: [
          {
            pools: Array(5).fill({ id: "1" }),
            filters: { minimumTotalValueLockedUsd: 0 },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    } as any);

    render(<PoolsSearchScreen />, { wrapper });
    const searchMoreBtn = screen.getByText(/pools.list.filter.searchMore/i);
    fireEvent.click(searchMoreBtn);
    expect(usePoolsSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        minLiquidityOverride: undefined,
      }),
    );
  });

  it("renders loading state", () => {
    vi.mocked(usePoolsSearch).mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false,
    } as any);

    render(<PoolsSearchScreen />, { wrapper });
    expect(screen.getByText(/Loading.../)).toBeDefined();
  });

  it("renders error state when no pools", () => {
    vi.mocked(usePoolsSearch).mockReturnValue({
      isLoading: false,
      data: { pages: [{ pools: [] }] },
      isError: true,
    } as any);

    render(<PoolsSearchScreen />, { wrapper });
    expect(screen.getByText(/Error State/)).toBeDefined();
  });
});
