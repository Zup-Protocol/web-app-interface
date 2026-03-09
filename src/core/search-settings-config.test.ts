import { describe, expect, it } from "vitest";
import { SearchSettingsConfig } from "./search-settings-config";

describe("SearchSettingsConfig", () => {
  it("should have correct default values", () => {
    expect(SearchSettingsConfig.default.minLiquidity).toBe("10000");
    expect(SearchSettingsConfig.default.blockedExchanges).toEqual([]);
  });

  it("should instantiate correctly via constructor", () => {
    const config = new SearchSettingsConfig("5000", ["uniswap-v2"]);
    expect(config.minLiquidity).toBe("5000");
    expect(config.blockedExchanges).toEqual(["uniswap-v2"]);
  });
});
