export enum YieldPeriod {
  Day = "24h",
  Week = "7d",
  Month = "30d",
  Quarter = "90d",
}

export class YieldPeriodUtils {
  static get values(): YieldPeriod[] {
    return Object.values(YieldPeriod);
  }

  static displayLabels: Record<YieldPeriod, string> = {
    [YieldPeriod.Day]: "24h",
    [YieldPeriod.Week]: "7d",
    [YieldPeriod.Month]: "30d",
    [YieldPeriod.Quarter]: "90d",
  };
}
