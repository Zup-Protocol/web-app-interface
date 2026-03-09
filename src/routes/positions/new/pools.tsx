import { PoolsCarousel } from "@/components/pools/pools-carousel";
import { TextButton } from "@/components/ui/buttons/text-button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { YieldPeriod, YieldPeriodUtils } from "@/core/enums/yield-period";
import { assetUrlParamHashSchema } from "@/core/schemas/asset-url-param.schema";
import { decodeAssetUrlParam } from "@/core/utils/asset-url-params-utils";
import { usePoolsSearch } from "@/hooks/pools/use-pools-search";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { LocalStorage } from "@/lib/utils/local-storage-service";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, m, type Variants } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  assetA: assetUrlParamHashSchema.optional(),
  assetB: assetUrlParamHashSchema.optional(),
  chainId: z.number().optional(),
});

export const Route = createFileRoute("/positions/new/pools")({
  component: PoolsSearchScreen,
  validateSearch: searchSchema,
});

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    x: -10,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function PoolsSearchScreen() {
  const { assetA, assetB, chainId } = Route.useSearch();
  const { translate } = useTranslation();
  const navigate = Route.useNavigate();
  const [activePeriod, setActivePeriod] = useState<YieldPeriod>(YieldPeriod.Day);
  const [minLiquidityOverride, setMinLiquidityOverride] = useState<number | undefined>();

  const decodedAssetA = useMemo(() => decodeAssetUrlParam(assetA), [assetA]);
  const decodedAssetB = useMemo(() => decodeAssetUrlParam(assetB), [assetB]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, isError, refetch } = usePoolsSearch({
    assetA: decodedAssetA,
    assetB: decodedAssetB,
    chainId,
    activePeriod,
    minLiquidityOverride,
  });

  const pools = useMemo(() => {
    return data?.pages.flatMap((page) => page.pools) || [];
  }, [data]);

  const appliedMinLiquidity = data?.pages[0]?.filters?.minimumTotalValueLockedUsd ?? 0;

  const settings = useMemo(() => LocalStorage.getSearchSettings(), []);
  const defaultMinLiquidity = Number(settings.minLiquidity) || 5000;

  const handleToggleLiquidityFilter = () => {
    if (appliedMinLiquidity > 0) {
      setMinLiquidityOverride(0);
    } else {
      setMinLiquidityOverride(undefined);
    }
  };

  return (
    <m.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 z-40 bg-background flex flex-col items-center sm:pt-[7vh] pt-5 w-full min-h-screen"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="w-full max-w-[688px] flex flex-col gap-[14px] px-4">
        <m.div variants={itemVariants} style={{ willChange: "transform, opacity, filter" }}>
          <TextButton onClick={() => navigate({ to: "/positions/new" })} icon={<ArrowLeftIcon />} className="w-fit">
            {translate(AppTranslationsKeys.POOLS_LIST_BACK_BUTTON)}
          </TextButton>
        </m.div>

        <m.header variants={itemVariants} className="flex flex-col gap-2" style={{ willChange: "transform, opacity, filter" }}>
          <h1 className="text-[28px] font-semibold text-foreground">{translate(AppTranslationsKeys.POOLS_LIST_TITLE)}</h1>
          <p className="text-mutated-text text-base">{translate(AppTranslationsKeys.POOLS_LIST_DESCRIPTION)}</p>
        </m.header>

        <m.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-3" style={{ willChange: "transform, opacity, filter" }}>
          <span className="text-foreground font-medium shrink-0">{translate(AppTranslationsKeys.POOLS_LIST_BEST_YIELDS_IN)}</span>
          <div className="flex items-center gap-3">
            <SegmentedControl
              options={YieldPeriodUtils.values.map((period) => ({
                label: YieldPeriodUtils.displayLabels[period],
                value: period,
              }))}
              value={activePeriod}
              onChange={(value) => setActivePeriod(value as YieldPeriod)}
            />
            <InfoTooltip
              content={
                <div>
                  <p>{translate(AppTranslationsKeys.POOLS_LIST_BEST_YIELDS_TOOLTIP_P1)}</p>
                  <p>{translate(AppTranslationsKeys.POOLS_LIST_BEST_YIELDS_TOOLTIP_P2)}</p>
                </div>
              }
            />
          </div>
        </m.div>

        <m.div variants={itemVariants} className="w-full pb-20 -mt-[14px] min-h-[400px]" style={{ willChange: "transform, opacity, filter" }}>
          <AnimatePresence mode="wait">
            <m.div
              key={`${activePeriod}-${appliedMinLiquidity}`}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {!isLoading && !(isError && pools.length === 0) && (
                <div className="text-sm text-mutated-text pt-3 mb-2">
                  {appliedMinLiquidity > 0 ? (
                    <>
                      <span className="inline">
                        {translate(AppTranslationsKeys.POOLS_LIST_FILTER_ACTIVE).replace(
                          "{amount}",
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(appliedMinLiquidity),
                        )}
                      </span>{" "}
                      <TextButton onClick={handleToggleLiquidityFilter} className="text-sm px-0 inline-flex">
                        {translate(AppTranslationsKeys.POOLS_LIST_FILTER_SEARCH_ALL)}
                      </TextButton>
                    </>
                  ) : (
                    <>
                      <span className="inline">{translate(AppTranslationsKeys.POOLS_LIST_FILTER_INACTIVE)}</span>{" "}
                      <TextButton onClick={handleToggleLiquidityFilter} className="text-sm px-0 inline-flex">
                        {translate(AppTranslationsKeys.POOLS_LIST_FILTER_SEARCH_MORE).replace(
                          "{amount}",
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(defaultMinLiquidity),
                        )}
                      </TextButton>
                    </>
                  )}
                </div>
              )}
              <PoolsCarousel
                pools={pools}
                isLoading={isLoading}
                isError={isError}
                isFetching={isFetching}
                refetch={refetch}
                hasNextPage={!!hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                yieldPeriod={activePeriod}
              />
            </m.div>
          </AnimatePresence>
        </m.div>
      </div>
    </m.div>
  );
}
