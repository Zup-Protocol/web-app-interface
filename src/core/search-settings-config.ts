import { ISearchSettingsConfig } from "./interfaces/search-settings-config.interface";

export class SearchSettingsConfig implements ISearchSettingsConfig {
  minLiquidity: string;
  blockedExchanges?: string[];

  constructor(minLiquidity: string, blockedExchanges?: string[]) {
    this.minLiquidity = minLiquidity;
    this.blockedExchanges = blockedExchanges;
  }

  static readonly default: ISearchSettingsConfig = {
    minLiquidity: "10000",
    blockedExchanges: [],
  };
}
