import LZString from "lz-string";
import { describe, expect, it } from "vitest";
import { SelectableAsset } from "../types/asset.types";
import { convertSelectableAssetToUrlParam, decodeAssetUrlParam, encodePoolsSearchData } from "./asset-url-params-utils";

describe("asset-url-params-utils", () => {
  describe("decodeAssetUrlParam", () => {
    it("should return undefined for falsy hash", () => {
      expect(decodeAssetUrlParam(undefined)).toBeUndefined();
      expect(decodeAssetUrlParam("")).toBeUndefined();
    });

    it("should return undefined for invalid compressed data", () => {
      expect(decodeAssetUrlParam("invalid-lz-data")).toBeUndefined();
    });

    it("should return undefined when decompressed data is not valid JSON", () => {
      const invalidJson = LZString.compressToEncodedURIComponent("not-json");
      expect(decodeAssetUrlParam(invalidJson)).toBeUndefined();
    });

    it("should return undefined when schema validation fails", () => {
      const invalidData = { type: "unknown" };
      const hash = LZString.compressToEncodedURIComponent(JSON.stringify(invalidData));
      expect(decodeAssetUrlParam(hash)).toBeUndefined();
    });

    it("should correctly decode a valid basket hash", () => {
      const basketData = { type: "basket" as const, id: "usd-stablecoins" };
      const hash = LZString.compressToEncodedURIComponent(JSON.stringify(basketData));
      expect(decodeAssetUrlParam(hash)).toEqual(basketData);
    });
  });

  describe("encodePoolsSearchData", () => {
    it("should decode valid asset data", () => {
      const data = { type: "single-chain-token" as const, chainId: 1, address: "0x123" };
      const hash = encodePoolsSearchData(data);
      expect(typeof hash).toBe("string");
      expect(decodeAssetUrlParam(hash)).toEqual(data);
    });

    it("should throw for invalid asset data", () => {
      // @ts-ignore - testing invalid input
      expect(() => encodePoolsSearchData({ type: "invalid" } as any)).toThrow();
    });
  });

  describe("convertSelectableAssetToUrlParam", () => {
    it("should convert basket correctly", () => {
      const asset = {
        type: "basket",
        id: "usd-stablecoins",
        basketId: "usd-stablecoins",
        name: "Basket 1",
        symbol: "B1",
        logoUrl: "",
        tokens: [],
        address: "0xb1",
        chainId: 1,
      } as any as SelectableAsset;
      const result = convertSelectableAssetToUrlParam(asset);
      expect(result).toEqual({ type: "basket", id: "usd-stablecoins" });
    });

    it("should convert single-chain correctly", () => {
      const asset = {
        type: "single-chain",
        chainId: 1,
        address: "0xabc",
        name: "Eth",
        symbol: "ETH",
        logoUrl: "",
        decimals: 18,
      } as any as SelectableAsset;
      const result = convertSelectableAssetToUrlParam(asset);
      expect(result).toEqual({ type: "single-chain-token", chainId: 1, address: "0xabc" });
    });

    it("should convert multi-chain correctly", () => {
      const addresses = [{ chainId: 1 as const, address: "0x1" }];
      const asset = {
        type: "multi-chain",
        addresses,
        name: "USDC",
        symbol: "USDC",
        logoUrl: "",
        decimals: 6,
      } as any as SelectableAsset;
      const result = convertSelectableAssetToUrlParam(asset);
      expect(result).toEqual({ type: "multi-chain-token", addresses });
    });

    it("should throw for unknown asset type", () => {
      // @ts-ignore - testing invalid type
      expect(() => convertSelectableAssetToUrlParam({ type: "invalid" } as any)).toThrow("unknown asset type");
    });
  });
});
