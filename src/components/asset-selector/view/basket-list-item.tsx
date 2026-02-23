"use client";

import type { TokenBasket } from "@/core/types/token.types";
import { BasketTooltipContent } from "./tooltips/basket-tooltip-content";

import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AssetListItem } from "./asset-list-item";

interface BasketListItemProps {
  basket: TokenBasket;
  onClick: () => void;
  className?: string;
}

export function BasketListItem({
  basket,
  onClick,
  className,
}: BasketListItemProps) {
  const { translate } = useTranslation();

  const tokensCount = basket.tokens.length.toString();
  const networksCount = basket.chainIds.length.toString();

  const tokensPart = translate(
    AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_TOKENS,
  ).replace("{count}", tokensCount);

  const networksPart = translate(
    basket.chainIds.length === 1
      ? AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORK
      : AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORKS,
  ).replace("{count}", networksCount);

  const subtitle = `${tokensPart} • ${networksPart}`;

  return (
    <AssetListItem
      title={basket.name}
      subtitle={subtitle}
      logoUrl={basket.logoUrl}
      assetName={basket.name}
      tooltipContent={<BasketTooltipContent basket={basket} />}
      onClick={onClick}
      className={className}
    />
  );
}
