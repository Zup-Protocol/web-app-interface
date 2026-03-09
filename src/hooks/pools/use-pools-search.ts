import { YieldPeriod } from "@/core/enums/yield-period";
import { IBasketUrlParam, IMultiChainTokenUrlParam, ISingleChainTokenUrlParam } from "@/core/interfaces/asset-url-param.interface";
import type { AssetUrlParam } from "@/core/types/asset.types";
import { LocalStorage } from "@/lib/utils/local-storage-service";
import { useHydric } from "@/providers/hydric-provider";
import type { HydricGateway } from "@hydric/gateway";
import { useInfiniteQuery } from "@tanstack/react-query";

type SearchLiquidityPoolsParams = Parameters<HydricGateway["liquidityPools"]["search"]>[0];

interface BuildAssetParamsResult {
  tokens?: { chainId: number; address: string }[];
  baskets?: { basketId: string; chainIds?: number[] }[];
}

function buildAssetParams(asset: AssetUrlParam, chainId?: number | null): BuildAssetParamsResult {
  if (asset.type === "basket") {
    const basketId = (asset as IBasketUrlParam).id;
    return {
      baskets: [
        {
          basketId,
          ...(chainId ? { chainIds: [chainId] } : {}),
        },
      ],
    };
  }

  if (asset.type === "single-chain-token") {
    const casted = asset as ISingleChainTokenUrlParam;
    return { tokens: [{ chainId: casted.chainId, address: casted.address }] };
  }

  if (asset.type === "multi-chain-token") {
    const casted = asset as IMultiChainTokenUrlParam;
    const validAddresses = chainId ? casted.addresses.filter((a) => a.chainId === chainId) : casted.addresses;

    return {
      tokens: validAddresses.map((a: { chainId: number; address: string }) => ({
        chainId: a.chainId,
        address: a.address,
      })),
    };
  }

  return {};
}

export function usePoolsSearch({
  assetA,
  assetB,
  chainId,
  activePeriod = YieldPeriod.Day,
  minLiquidityOverride,
}: {
  assetA?: AssetUrlParam;
  assetB?: AssetUrlParam;
  chainId?: number | null;
  activePeriod?: YieldPeriod;
  minLiquidityOverride?: number;
}) {
  const hydric = useHydric();
  const settings = LocalStorage.getSearchSettings();

  return useInfiniteQuery({
    queryKey: ["pools-search", assetA, assetB, chainId, activePeriod, minLiquidityOverride !== undefined ? minLiquidityOverride : settings.minLiquidity, settings.blockedExchanges],
    queryFn: async ({ pageParam }) => {
      const querySettings = LocalStorage.getSearchSettings();
      const paramsA = buildAssetParams(assetA!, chainId);
      const paramsB = buildAssetParams(assetB!, chainId);

      const searchParams: SearchLiquidityPoolsParams = {
        config: {
          limit: 20,
          cursor: pageParam as string | undefined,
          orderBy: {
            field: "yield",
            direction: "desc",
            timeframe: activePeriod,
          },
        },
        filters: {
          minimumTotalValueLockedUsd: minLiquidityOverride !== undefined ? minLiquidityOverride : Number(querySettings.minLiquidity) || 0,
        },
      };

      const hasAssetA = !!(paramsA.tokens?.length || paramsA.baskets?.length);
      const hasAssetB = !!(paramsB.tokens?.length || paramsB.baskets?.length);

      if (!hasAssetA || !hasAssetB) {
        return {
          pools: [],
          nextCursor: undefined as string | undefined,
          filters: { minimumTotalValueLockedUsd: 0 },
        };
      }

      const tokensA = paramsA.tokens as SearchLiquidityPoolsParams["tokensA"];
      const basketsA = paramsA.baskets as SearchLiquidityPoolsParams["basketsA"];
      const tokensB = paramsB.tokens as SearchLiquidityPoolsParams["tokensB"];
      const basketsB = paramsB.baskets as SearchLiquidityPoolsParams["basketsB"];

      if (tokensA && tokensA.length > 0) searchParams.tokensA = tokensA;
      if (basketsA && basketsA.length > 0) searchParams.basketsA = basketsA;

      if (tokensB && tokensB.length > 0) searchParams.tokensB = tokensB;
      if (basketsB && basketsB.length > 0) searchParams.basketsB = basketsB;

      if (querySettings.blockedExchanges && querySettings.blockedExchanges.length > 0) {
        searchParams.filters!.blockedProtocols = querySettings.blockedExchanges as string[];
      }

      return hydric!.liquidityPools.search(searchParams);
    },
    getNextPageParam: (lastPage) => (lastPage.nextCursor as string | undefined) || undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!assetA && !!assetB && !!hydric,
    staleTime: 10 * 60 * 1000,
  });
}
