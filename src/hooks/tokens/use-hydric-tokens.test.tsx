import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHydricTokens } from "./use-hydric-tokens";
import { useHydric } from "@/providers/hydric-provider";

vi.mock("@/providers/hydric-provider", () => ({
  useHydric: vi.fn(),
}));

describe("useHydricTokens", () => {
    const createQueryClient = () => new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } }
    });

    const mockHydric = {
        singleChainTokens: {
            list: vi.fn(),
            search: vi.fn(),
        },
        multichainTokens: {
            list: vi.fn(),
            search: vi.fn(),
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useHydric).mockReturnValue(mockHydric as any);
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    it("fetches single chain tokens list", async () => {
        mockHydric.singleChainTokens.list.mockResolvedValue({ tokens: [{ id: '1' }], total: 1 });
        const { result } = renderHook(() => useHydricTokens({ chainId: 1 }), { wrapper });
        
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.tokens[0].type).toBe("single-chain");
        expect(mockHydric.singleChainTokens.list).toHaveBeenCalled();
    });

    it("searches single chain tokens", async () => {
        mockHydric.singleChainTokens.search.mockResolvedValue({ tokens: [{ id: '1' }], total: 1 });
        const { result } = renderHook(() => useHydricTokens({ chainId: 1, search: 'test' }), { wrapper });
        
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockHydric.singleChainTokens.search).toHaveBeenCalledWith(1, expect.objectContaining({ search: 'test' }));
    });

    it("fetches multi chain tokens list", async () => {
        mockHydric.multichainTokens.list.mockResolvedValue({ tokens: [{ id: '1' }], total: 1 });
        const { result } = renderHook(() => useHydricTokens({}), { wrapper });
        
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.tokens[0].type).toBe("multi-chain");
        expect(mockHydric.multichainTokens.list).toHaveBeenCalled();
    });

    it("searches multi chain tokens", async () => {
        mockHydric.multichainTokens.search.mockResolvedValue({ tokens: [{ id: '1' }], total: 1 });
        const { result } = renderHook(() => useHydricTokens({ search: 'test' }), { wrapper });
        
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockHydric.multichainTokens.search).toHaveBeenCalledWith(expect.objectContaining({ search: 'test' }));
    });

    it("handles pagination cursor", async () => {
        mockHydric.multichainTokens.list.mockResolvedValue({ tokens: [], nextCursor: 'next-123' });
        const { result } = renderHook(() => useHydricTokens({}), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.hasNextPage).toBe(true);
    });
});
