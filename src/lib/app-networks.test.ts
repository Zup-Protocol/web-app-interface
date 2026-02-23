import {
  base,
  hyperEvm,
  mainnet,
  monad,
  plasma,
  scroll,
  unichain,
} from "viem/chains";
import { describe, expect, it } from "vitest";
import { AppNetworks, AppNetworksUtils } from "./app-networks";

describe("AppNetworksUtils.chainId", () => {
  it("should have correct chain IDs for all networks", () => {
    expect(AppNetworksUtils.chainId[AppNetworks.ETHEREUM]).toBe(mainnet.id);
    expect(AppNetworksUtils.chainId[AppNetworks.BASE]).toBe(base.id);
    expect(AppNetworksUtils.chainId[AppNetworks.HYPER_EVM]).toBe(hyperEvm.id);
    expect(AppNetworksUtils.chainId[AppNetworks.UNICHAIN]).toBe(unichain.id);
    expect(AppNetworksUtils.chainId[AppNetworks.SCROLL]).toBe(scroll.id);
    expect(AppNetworksUtils.chainId[AppNetworks.PLASMA]).toBe(plasma.id);
    expect(AppNetworksUtils.chainId[AppNetworks.MONAD]).toBe(monad.id);
  });

  it("should return undefined for ALL_NETWORKS", () => {
    expect(AppNetworksUtils.chainId[AppNetworks.ALL_NETWORKS]).toBeUndefined();
  });

  it("should match wagmiNetwork IDs", () => {
    AppNetworksUtils.values.forEach((network) => {
      const chainId = AppNetworksUtils.chainId[network];
      const wagmiChain = AppNetworksUtils.wagmiNetwork[network];

      if (network === AppNetworks.ALL_NETWORKS) {
        expect(chainId).toBeUndefined();
        expect(wagmiChain).toBeUndefined();
      } else {
        expect(chainId).toBe(wagmiChain?.id);
      }
    });
  });
});

describe("AppNetworksUtils.chainIdToNetwork", () => {
  it("should correctly map chain IDs to AppNetworks", () => {
    expect(AppNetworksUtils.chainIdToNetwork[mainnet.id]).toBe(
      AppNetworks.ETHEREUM,
    );
    expect(AppNetworksUtils.chainIdToNetwork[base.id]).toBe(AppNetworks.BASE);
    expect(AppNetworksUtils.chainIdToNetwork[hyperEvm.id]).toBe(
      AppNetworks.HYPER_EVM,
    );
    expect(AppNetworksUtils.chainIdToNetwork[unichain.id]).toBe(
      AppNetworks.UNICHAIN,
    );
    expect(AppNetworksUtils.chainIdToNetwork[scroll.id]).toBe(
      AppNetworks.SCROLL,
    );
    expect(AppNetworksUtils.chainIdToNetwork[plasma.id]).toBe(
      AppNetworks.PLASMA,
    );
    expect(AppNetworksUtils.chainIdToNetwork[monad.id]).toBe(AppNetworks.MONAD);
  });

  it("should have a mapping for every supported chain ID", () => {
    AppNetworksUtils.values.forEach((network) => {
      if (network === AppNetworks.ALL_NETWORKS) return;

      const chainId = AppNetworksUtils.chainId[network];
      expect(chainId).toBeDefined();
      expect(AppNetworksUtils.chainIdToNetwork[chainId!]).toBe(network);
    });
  });
});
