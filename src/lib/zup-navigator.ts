import type { SelectableAsset } from "@/core/types/asset.types";
import { convertSelectableAssetToUrlParam, encodePoolsSearchData } from "@/core/utils/asset-url-params-utils";
import { useNavigate } from "@tanstack/react-router";

interface PoolsSearchNavigationParams {
  assetA: SelectableAsset;
  assetB: SelectableAsset;
  chainId?: number;
}

export function useZupNavigator() {
  const navigate = useNavigate();

  return {
    navigateToPoolsSearch({ assetA, assetB, chainId }: PoolsSearchNavigationParams) {
      return navigate({
        to: "/positions/new/pools",
        search: {
          assetA: encodePoolsSearchData(convertSelectableAssetToUrlParam(assetA)),
          assetB: encodePoolsSearchData(convertSelectableAssetToUrlParam(assetB)),
          chainId,
        },
      });
    },
  };
}
