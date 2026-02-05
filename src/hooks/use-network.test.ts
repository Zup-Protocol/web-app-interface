import { AppNetworks } from "@/lib/app-networks";
import { currentAppNetworkStore } from "@/lib/stores/app-network-store";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAppNetwork } from "./use-network";

describe("useAppNetwork", () => {
  it("returns current network and setter", () => {
    currentAppNetworkStore.set(AppNetworks.ALL_NETWORKS);
    const { result } = renderHook(() => useAppNetwork());

    expect(result.current.network).toBe(AppNetworks.ALL_NETWORKS);
    expect(typeof result.current.setAppNetwork).toBe("function");
  });

  it("updates network when setter is called", () => {
    const { result } = renderHook(() => useAppNetwork());

    act(() => {
      result.current.setAppNetwork(AppNetworks.BASE);
    });

    expect(result.current.network).toBe(AppNetworks.BASE);
  });
});
