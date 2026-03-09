import { SelectableAsset } from "@/core/types/asset.types";
import { decodeAssetUrlParam } from "@/core/utils/asset-url-params-utils";
import { useNavigate } from "@tanstack/react-router";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useZupNavigator } from "./zup-navigator";

// Mock tanstack router
vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("useZupNavigator", () => {
  const mockNavigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);

  const mockAsset: SelectableAsset = {
    type: "single-chain",
    chainId: 1,
    address: "0x123",
    name: "Ethereum",
    symbol: "ETH",
    logoUrl: "",
    decimals: 18,
  };

  it("should navigate to pools search with encoded params", () => {
    const { result } = renderHook(() => useZupNavigator());

    result.current.navigateToPoolsSearch({
      assetA: mockAsset,
      assetB: mockAsset,
      chainId: 1,
    });

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/positions/new/pools",
      search: {
        assetA: expect.any(String),
        assetB: expect.any(String),
        chainId: 1,
      },
    });

    const callArgs = mockNavigate.mock.calls[0][0];
    const decodedA = decodeAssetUrlParam(callArgs.search.assetA);
    const decodedB = decodeAssetUrlParam(callArgs.search.assetB);

    expect(decodedA).toEqual({ type: "single-chain-token", chainId: 1, address: "0x123" });
    expect(decodedB).toEqual({ type: "single-chain-token", chainId: 1, address: "0x123" });
  });
});
