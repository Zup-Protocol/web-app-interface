interface IBaseAssetUrlParam {
  type: "basket" | "multi-chain-token" | "single-chain-token";
}

export interface IBasketUrlParam extends IBaseAssetUrlParam {
  id: string;
}

export interface ISingleChainTokenUrlParam extends IBaseAssetUrlParam {
  chainId: number;
  address: string;
}

export interface IMultiChainTokenUrlParam extends IBaseAssetUrlParam {
  addresses: {
    chainId: number;
    address: string;
  }[];
}
