import {
    type MultiChainToken,
    type SingleChainToken,
} from "@/core/types/token.types";
import { useHydric } from "@/providers/hydric-provider";
import { type HydricGateway } from "@hydric/gateway";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseHydricTokensParams {
  chainId?: number;
  search?: string;
}

const PAGE_SIZE = 50;

type HydricChainId = Parameters<HydricGateway["singleChainTokens"]["list"]>[0];

export function useHydricTokens({
  chainId,
  search,
}: UseHydricTokensParams = {}) {
  const hydric = useHydric();

  return useInfiniteQuery({
    queryKey: ["hydric-tokens", chainId, search],
    enabled: !!hydric,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: {
      nextCursor?: string | null | Record<string, unknown>;
    }) => {
      if (typeof lastPage.nextCursor === "string") return lastPage.nextCursor;
      return undefined;
    },
    queryFn: async ({ pageParam }) => {
      if (!hydric) throw new Error("Hydric not initialized");

      const config = {
        limit: PAGE_SIZE,
        cursor: pageParam,
      };

      if (chainId) {
        // Single Chain Mode
        if (search) {
          const result = await hydric.singleChainTokens.search(
            chainId as HydricChainId,
            {
              search,
              config,
            },
          );
          return { ...result, nextCursor: result.nextCursor as string | null };
        }
        const result = await hydric.singleChainTokens.list(
          chainId as HydricChainId,
          {
            config: {
              ...config,
              orderBy: { field: "tvl", direction: "desc" },
            },
          },
        );
        return { ...result, nextCursor: result.nextCursor as string | null };
      }

      // Multi Chain Mode
      if (search) {
        const result = await hydric.multichainTokens.search({
          search,
          config,
        });
        return { ...result, nextCursor: result.nextCursor as string | null };
      }

      const result = await hydric.multichainTokens.list({
        config: {
          ...config,
          orderBy: { field: "tvl", direction: "desc" },
        },
      });
      return { ...result, nextCursor: result.nextCursor as string | null };
    },
    select: (data) => {
      // The return type of queryFn depends on the branch, but they all have `tokens` array.
      // We know the shape, so we can cast `page` to any.
      const allTokens = data.pages.flatMap((page: any) => page.tokens);

      const mappedTokens = allTokens.map((token: any) => {
        if (chainId) {
          return {
            ...token,
            type: "single-chain",
          } as SingleChainToken;
        }
        return {
          ...token,
          type: "multi-chain",
        } as MultiChainToken;
      });

      return {
        tokens: mappedTokens,
        total: (data.pages[0] as any)?.total ?? 0,
      };
    },
  });
}
