import { YieldPeriod } from "@/core/enums/yield-period";
import { LocalStorage } from "@/lib/utils/local-storage-service";
import { useHydric } from "@/providers/hydric-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePoolsSearch } from "./use-pools-search";

vi.mock("@/providers/hydric-provider", () => ({
  useHydric: vi.fn(),
}));

vi.mock("@/lib/utils/local-storage-service", () => ({
  LocalStorage: {
    getSearchSettings: vi.fn(),
  },
}));

describe("usePoolsSearch", () => {
  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

  const mockHydric = {
    liquidityPools: {
      search: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useHydric).mockReturnValue(mockHydric as any);
    vi.mocked(LocalStorage.getSearchSettings).mockReturnValue({ minLiquidity: "0", blockedExchanges: [] });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>;

  it("searches pools with single-chain tokens", async () => {
    mockHydric.liquidityPools.search.mockResolvedValue({ pools: [], nextCursor: null });

    const { result } = renderHook(
      () =>
        usePoolsSearch({
          assetA: { type: "single-chain-token", address: "0x1", chainId: 1 } as any,
          assetB: { type: "single-chain-token", address: "0x2", chainId: 1 } as any,
          chainId: 1,
          activePeriod: YieldPeriod.Day,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockHydric.liquidityPools.search).toHaveBeenCalledWith(
      expect.objectContaining({
        tokensA: [{ chainId: 1, address: "0x1" }],
        tokensB: [{ chainId: 1, address: "0x2" }],
      }),
    );
  });

  it("searches pools with multi-chain tokens", async () => {
    mockHydric.liquidityPools.search.mockResolvedValue({ pools: [], nextCursor: null });

    const { result } = renderHook(
      () =>
        usePoolsSearch({
          assetA: {
            type: "multi-chain-token",
            id: "m1",
            addresses: [
              { chainId: 1, address: "0x1" },
              { chainId: 2, address: "0x2" },
            ],
          } as any,
          assetB: { type: "single-chain-token", address: "0x3", chainId: 1 } as any,
          chainId: 1,
          activePeriod: YieldPeriod.Day,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockHydric.liquidityPools.search).toHaveBeenCalledWith(
      expect.objectContaining({
        tokensA: [{ chainId: 1, address: "0x1" }],
        tokensB: [{ chainId: 1, address: "0x3" }],
      }),
    );
  });

  it("searches pools with baskets", async () => {
    mockHydric.liquidityPools.search.mockResolvedValue({ pools: [], nextCursor: null });

    const { result } = renderHook(
      () =>
        usePoolsSearch({
          assetA: { type: "basket", id: "b1" } as any,
          assetB: { type: "single-chain-token", address: "0x2", chainId: 1 } as any,
          chainId: 1,
          activePeriod: YieldPeriod.Day,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockHydric.liquidityPools.search).toHaveBeenCalledWith(
      expect.objectContaining({
        basketsA: [{ basketId: "b1", chainIds: [1] }],
      }),
    );
  });

  it("handles blocked protocols from settings", async () => {
    vi.mocked(LocalStorage.getSearchSettings).mockReturnValue({
      minLiquidity: "100",
      blockedExchanges: ["uniswap"],
    });
    mockHydric.liquidityPools.search.mockResolvedValue({ pools: [], nextCursor: null });

    const { result } = renderHook(
      () =>
        usePoolsSearch({
          assetA: { type: "single-chain-token", address: "0x1", chainId: 1 } as any,
          assetB: { type: "single-chain-token", address: "0x2", chainId: 1 } as any,
          chainId: 1,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockHydric.liquidityPools.search).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({
          blockedProtocols: ["uniswap"],
          minimumTotalValueLockedUsd: 100,
        }),
      }),
    );
  });

  it("returns empty pools if assets are missing", async () => {
    const { result } = renderHook(
      () =>
        usePoolsSearch({
          assetA: undefined,
          assetB: { type: "single-chain-token", address: "0x2", chainId: 1 } as any,
        }),
      { wrapper },
    );

    expect(result.current.isEnabled).toBe(false);
  });
});
