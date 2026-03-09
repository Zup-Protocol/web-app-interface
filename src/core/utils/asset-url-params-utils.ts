import LZString from "lz-string";
import { IBasketUrlParam, ISingleChainTokenUrlParam } from "../interfaces/asset-url-param.interface";
import { assetUrlParamSchema } from "../schemas/asset-url-param.schema";
import { AssetUrlParam, SelectableAsset } from "../types/asset.types";

export function decodeAssetUrlParam(hash: string | undefined): AssetUrlParam | undefined {
  if (!hash) return undefined;
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(hash);
    if (!decompressed) return undefined;
    const json = JSON.parse(decompressed);
    return assetUrlParamSchema.parse(json) as AssetUrlParam;
  } catch {
    return undefined;
  }
}

export const encodePoolsSearchData = (data: AssetUrlParam): string => {
  const parsed = assetUrlParamSchema.parse(data);
  return LZString.compressToEncodedURIComponent(JSON.stringify(parsed));
};

export const convertSelectableAssetToUrlParam = (asset: SelectableAsset): AssetUrlParam => {
  if (asset.type === "basket") {
    const basket: IBasketUrlParam = {
      id: asset.id,
      type: "basket",
    };
    return basket;
  }
  if (asset.type === "single-chain") {
    const singleChainToken: ISingleChainTokenUrlParam = {
      address: asset.address,
      chainId: asset.chainId,
      type: "single-chain-token",
    };
    return singleChainToken;
  }
  if (asset.type === "multi-chain") {
    return {
      type: "multi-chain-token",
      addresses: asset.addresses,
    };
  }
  throw `unknown asset type`;
};
