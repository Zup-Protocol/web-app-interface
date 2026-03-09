import { YieldPeriod, YieldPeriodUtils } from "@/core/enums/yield-period";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppNetworksUtils } from "@/lib/app-networks";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { SupportedDexs, SupportedDexsUtils } from "@/lib/supported-dexs";
import { ThemeMode } from "@/lib/theme-mode";
import { cn } from "@/lib/utils";
import { type LiquidityPool } from "@hydric/gateway";
import { m } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { AssetLogo } from "../ui/asset-logo";
import { PrimaryButton } from "../ui/buttons/primary-button";
import { InfoTooltip, type InfoTooltipHandle } from "../ui/info-tooltip";

export class PoolCardConstants {
  static readonly WIDTH = 320;
  static readonly MIN_HEIGHT = 318;
}

export function PoolCard({
  pool,
  onClickDeposit,
  yieldPeriod = YieldPeriod.Day,
  className,
}: {
  pool: LiquidityPool;
  onClickDeposit?: () => void;
  yieldPeriod?: YieldPeriod;
  className?: string;
}) {
  const { translate } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDesktop = useMediaQuery(ScreenBreakpoints.DESKTOP);
  const mobileYieldTooltipRef = React.useRef<InfoTooltipHandle>(null);

  const tokenA = pool.tokens[0];
  const tokenB = pool.tokens[1];
  const networkInfo = AppNetworksUtils.chainIdToNetwork[pool.chainId];

  const currentYield = pool.stats[`stats${yieldPeriod}`].yield ?? 0;

  const displayYield = (
    <span className="text-3xl font-medium text-green-600 dark:text-green-300" onClick={() => mobileYieldTooltipRef.current?.open()}>
      {new Intl.NumberFormat("en-US", {
        style: "percent",
        maximumFractionDigits: 1,
      }).format(currentYield / 100)}
    </span>
  );

  const displayTvl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(pool.balance.totalValueLockedUsd);

  const yieldTooltipContent = (
    <div className="flex flex-col gap-5 p-1">
      <p className="text-[15px] text-mutated-text leading-relaxed">
        {translate(AppTranslationsKeys.POOL_CARD_YIELD_TOOLTIP_DESC).replace("{period}", YieldPeriodUtils.displayLabels[yieldPeriod])}
      </p>
      <div className="flex flex-col gap-3">
        {YieldPeriodUtils.values
          .filter((period) => period !== yieldPeriod)
          .map((period: YieldPeriod) => {
            const stats = pool.stats[`stats${period}`];
            const label = YieldPeriodUtils.displayLabels[period];
            const value = new Intl.NumberFormat("en-US", {
              style: "percent",
              maximumFractionDigits: 1,
            }).format(stats.yield / 100);

            return (
              <div key={period} className="flex items-center justify-between gap-8 border-b border-divider/50 pb-2 last:border-0 last:pb-0">
                <span className="font-medium text-base text-foreground">{translate(AppTranslationsKeys.POOL_CARD_N_YIELD).replace("{label}", label)}</span>
                <span className="text-base text-mutated-text">{value}</span>
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1], // Faster out-expo
      }}
      style={{ willChange: "transform, opacity", minHeight: PoolCardConstants.MIN_HEIGHT }}
      className={cn(
        "flex flex-col bg-card rounded-[30px] p-6 w-full shrink-0 gap-4 relative",
        "border border-divider dark:border-transparent transition-colors duration-300",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            <AssetLogo url={tokenA.logoUrl} symbol={tokenA.symbol} name={tokenA.name} size={32} className="z-10 bg-background" />
            <AssetLogo url={tokenB.logoUrl} symbol={tokenB.symbol} name={tokenB.name} size={32} className="bg-background" />
          </div>
          <span className="font-semibold text-foreground">
            {tokenA.symbol}/{tokenB.symbol}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col">
          {isDesktop ? (
            <div className="flex items-center gap-1">
              {displayYield}
              <InfoTooltip contentClassName="max-w-[240px]" content={yieldTooltipContent} />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {displayYield}
              <InfoTooltip ref={mobileYieldTooltipRef} contentClassName="max-w-[240px]" content={yieldTooltipContent} />
            </div>
          )}
          <span className="text-sm text-mutated-text">{translate(AppTranslationsKeys.POOL_CARD_YEARLY_YIELD).replace("{period}", yieldPeriod.replace("stats", ""))}</span>
        </div>

        <div className="w-px h-12 bg-divider"></div>

        <div className="flex flex-col items-end">
          <span className="text-2xl font-medium text-foreground">{displayTvl}</span>
          <span className="text-sm text-mutated-text">{translate(AppTranslationsKeys.POOL_CARD_DEPOSITED)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-auto">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              {(() => {
                const dexInfo = SupportedDexsUtils.metadata[pool.protocol.id as SupportedDexs];
                const logoUrl = dexInfo.logo;
                const name = dexInfo.name;

                return (
                  <>
                    <img src={logoUrl} alt={name} className="w-[36px] h-[36px] rounded-full" />
                    <span className="font-medium text-base text-foreground truncate pr-4">{name}</span>
                  </>
                );
              })()}
            </div>
            <span className="text-sm text-mutated-text shrink-0">{translate(AppTranslationsKeys.POOL_CARD_PROTOCOL)}</span>
          </div>
          {(() => {
            const Icon = AppNetworksUtils.logoSvg[networkInfo];
            const activeIcon = resolvedTheme === ThemeMode.DARK ? Icon.dark : Icon.light;

            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <div className="w-[36px] h-[36px] flex items-center justify-center">
                    <img src={activeIcon} alt="Chain" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="font-medium text-base text-foreground truncate pr-4">{AppNetworksUtils.networkName[networkInfo]}</span>
                </div>
                <span className="text-sm text-mutated-text pr-2 shrink-0">{translate(AppTranslationsKeys.POOL_CARD_BLOCKCHAIN)}</span>
              </div>
            );
          })()}
        </div>

        <PrimaryButton className="w-full justify-center h-12 rounded-2xl" onClick={onClickDeposit} icon={<ArrowRightIcon size={18} />} layout={false} disableInitialAnimation>
          {translate(AppTranslationsKeys.POOL_CARD_DEPOSIT_BUTTON)}
        </PrimaryButton>
      </div>
    </m.div>
  );
}
