import { AppNetworks } from "@/lib/app-networks";
import { beforeEach, describe, expect, it } from "vitest";
import { currentAppNetworkStore, setAppNetwork } from "./app-network-store";

describe("app-network-store", () => {
  beforeEach(() => {
    currentAppNetworkStore.set(AppNetworks.ALL_NETWORKS);
  });

  it("has default network as ALL_NETWORKS", () => {
    expect(currentAppNetworkStore.get()).toBe(AppNetworks.ALL_NETWORKS);
  });

  it("sets network correctly", () => {
    setAppNetwork(AppNetworks.ETHEREUM);
    expect(currentAppNetworkStore.get()).toBe(AppNetworks.ETHEREUM);
  });
});
