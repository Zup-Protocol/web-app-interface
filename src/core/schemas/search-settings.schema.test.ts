import { describe, expect, it } from "vitest";
import { searchSettingsSchema } from "./search-settings.schema";

describe("search-settings.schema", () => {
  it("should accept valid settings", () => {
    const valid = { minLiquidity: "5000", blockedExchanges: ["uniswap-v3"] };
    const result = searchSettingsSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(valid);
    }
  });

  it("should default blockedExchanges to empty array", () => {
    const minOnly = { minLiquidity: "10000" };
    const result = searchSettingsSchema.safeParse(minOnly);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.blockedExchanges).toEqual([]);
    }
  });

  it("should reject when minLiquidity is not a string", () => {
    const invalid = { minLiquidity: 10000 };
    expect(searchSettingsSchema.safeParse(invalid).success).toBe(false);
  });

  it("should reject when blockedExchanges is not an array", () => {
    const invalid = { minLiquidity: "1000", blockedExchanges: "none" };
    expect(searchSettingsSchema.safeParse(invalid).success).toBe(false);
  });
});
