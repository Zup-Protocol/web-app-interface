import { describe, expect, it } from "vitest";
import { YieldPeriod, YieldPeriodUtils } from "./yield-period";

describe("YieldPeriod", () => {
  it("should have correct enum values for SDK compatibility", () => {
    expect(YieldPeriod.Day).toBe("24h");
    expect(YieldPeriod.Week).toBe("7d");
    expect(YieldPeriod.Month).toBe("30d");
    expect(YieldPeriod.Quarter).toBe("90d");
  });

  describe("YieldPeriodUtils", () => {
    it("should return all enum values", () => {
      const values = YieldPeriodUtils.values;
      expect(values).toHaveLength(4);
      expect(values).toContain(YieldPeriod.Day);
      expect(values).toContain(YieldPeriod.Week);
      expect(values).toContain(YieldPeriod.Month);
      expect(values).toContain(YieldPeriod.Quarter);
    });

    it("should mapping all periods to display labels", () => {
      expect(YieldPeriodUtils.displayLabels[YieldPeriod.Day]).toBe("24h");
      expect(YieldPeriodUtils.displayLabels[YieldPeriod.Week]).toBe("7d");
      expect(YieldPeriodUtils.displayLabels[YieldPeriod.Month]).toBe("30d");
      expect(YieldPeriodUtils.displayLabels[YieldPeriod.Quarter]).toBe("90d");
    });
  });
});
