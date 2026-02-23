"use client";

import type {
  MultiChainToken,
  SingleChainToken,
} from "@/core/types/token.types";
import { TokenTooltipContent } from "./tooltips/token-tooltip-content";

import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppNetworksUtils } from "@/lib/app-networks";
import { AssetListItem } from "./asset-list-item";

interface TokenListItemProps {
  token: SingleChainToken | MultiChainToken;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function TokenListItem({
  token,
  onClick,
  disabled,
  className,
}: TokenListItemProps) {
  const { translate } = useTranslation();
  const isMultiChain = token.type === "multi-chain";
  const networkCount = isMultiChain ? token.chainIds.length : 1;
  const tokenNetwork = isMultiChain ? token.chainIds[0] : token.chainId;

  const networkInfo =
    networkCount === 1
      ? AppNetworksUtils.networkName[
          AppNetworksUtils.chainIdToNetwork[tokenNetwork]
        ]
      : translate(
          AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORKS,
        ).replace("{count}", networkCount.toString());

  const subtitle = `${token.name} • ${networkInfo}`;

  return (
    <AssetListItem
      title={token.symbol}
      subtitle={subtitle}
      logoUrl={token.logoUrl}
      assetName={token.name}
      assetSymbol={token.symbol}
      tooltipContent={<TokenTooltipContent token={token} />}
      onClick={onClick}
      disabled={disabled}
      className={className}
    />
  );
}
