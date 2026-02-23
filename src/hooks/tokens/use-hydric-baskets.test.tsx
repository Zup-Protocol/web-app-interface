import { useHydric } from "@/providers/hydric-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHydricBaskets } from "./use-hydric-baskets";

// Mock useHydric
vi.mock("@/providers/hydric-provider", () => ({
  useHydric: vi.fn(),
}));

const mockHydric = {
  tokenBaskets: {
    list: vi.fn(),
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useHydricBaskets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    (useHydric as any).mockReturnValue(mockHydric);
  });

  it("should fetch all baskets when no chainId is provided", async () => {
    const mockBaskets = [{ id: "basket-1", name: "Basket 1" }];
    mockHydric.tokenBaskets.list.mockResolvedValue({ baskets: mockBaskets });

    const { result } = renderHook(() => useHydricBaskets(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockHydric.tokenBaskets.list).toHaveBeenCalledWith({
      chainIds: undefined,
    });
    expect(result.current.data).toEqual([
      { id: "basket-1", name: "Basket 1", type: "basket" },
    ]);
  });

  it("should filter by chainId when provided", async () => {
    const activeChainId = 8453;
    const mockBaskets = [{ id: "basket-base", name: "Base Basket" }];
    mockHydric.tokenBaskets.list.mockResolvedValue({ baskets: mockBaskets });

    const { result } = renderHook(() => useHydricBaskets(activeChainId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockHydric.tokenBaskets.list).toHaveBeenCalledWith({
      chainIds: [activeChainId],
    });
    expect(result.current.data).toEqual([
      { id: "basket-base", name: "Base Basket", type: "basket" },
    ]);
  });

  it("should use chainId in the queryKey for correct caching", async () => {
    mockHydric.tokenBaskets.list.mockResolvedValue({ baskets: [] });

    const chainId1 = 1;
    const chainId2 = 8453;

    const { rerender } = renderHook(
      ({ chainId }) => useHydricBaskets(chainId),
      {
        wrapper,
        initialProps: { chainId: chainId1 },
      },
    );

    // Initial fetch for chainId 1
    expect(mockHydric.tokenBaskets.list).toHaveBeenCalledWith({
      chainIds: [chainId1],
    });

    // Rerender with different chainId
    rerender({ chainId: chainId2 });

    // Should fetch again for chainId 2
    expect(mockHydric.tokenBaskets.list).toHaveBeenCalledWith({
      chainIds: [chainId2],
    });

    // Check that we have 2 calls
    expect(mockHydric.tokenBaskets.list).toHaveBeenCalledTimes(2);
  });
});
