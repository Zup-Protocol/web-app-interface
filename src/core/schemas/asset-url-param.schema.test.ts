import LZString from "lz-string";
import { describe, expect, it } from "vitest";
import { assetUrlParamHashSchema, assetUrlParamSchema } from "./asset-url-param.schema";

describe("asset-url-param.schema", () => {
  describe("assetUrlParamSchema", () => {
    it("should accept a valid basket param", () => {
      const basket = { type: "basket", id: "b123" };
      const result = assetUrlParamSchema.safeParse(basket);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(basket);
      }
    });

    it("should accept a valid single-chain-token param", () => {
      const token = { type: "single-chain-token", chainId: 1, address: "0x123" };
      const result = assetUrlParamSchema.safeParse(token);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(token);
      }
    });

    it("should accept a valid multi-chain-token param", () => {
      const token = {
        type: "multi-chain-token",
        addresses: [
          { chainId: 1, address: "0x1" },
          { chainId: 137, address: "0x2" },
        ],
      };
      const result = assetUrlParamSchema.safeParse(token);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(token);
      }
    });

    it("should reject invalid types", () => {
      // @ts-ignore - testing invalid type
      expect(assetUrlParamSchema.safeParse({ type: "unknown" }).success).toBe(false);
      // @ts-ignore - testing invalid type
      expect(assetUrlParamSchema.safeParse({ type: "invalid" }).success).toBe(false);
      expect(assetUrlParamSchema.safeParse(null).success).toBe(false);
    });

    it("should reject missing required fields", () => {
      expect(assetUrlParamSchema.safeParse({ type: "basket" }).success).toBe(false);
      expect(assetUrlParamSchema.safeParse({ type: "single-chain-token", chainId: 1 }).success).toBe(false);
      // @ts-ignore - testing invalid type
      expect(assetUrlParamSchema.safeParse({ type: "multi-chain-token", addresses: "not-an-array" }).success).toBe(false);
    });
  });

  describe("assetUrlParamHashSchema", () => {
    it("should accept a valid compressed hash", () => {
      const data = { type: "basket", id: "b1" };
      const hash = LZString.compressToEncodedURIComponent(JSON.stringify(data));
      expect(assetUrlParamHashSchema.safeParse(hash).success).toBe(true);
    });

    it("should accept empty string (optional)", () => {
      expect(assetUrlParamHashSchema.safeParse("").success).toBe(true);
    });

    it("should reject invalid compressed data", () => {
      expect(assetUrlParamHashSchema.safeParse("invalid-hash").success).toBe(false);
    });

    it("should reject valid compressed data but invalid schema", () => {
      const invalidData = { type: "invalid" };
      const hash = LZString.compressToEncodedURIComponent(JSON.stringify(invalidData));
      expect(assetUrlParamHashSchema.safeParse(hash).success).toBe(false);
    });
  });
});
