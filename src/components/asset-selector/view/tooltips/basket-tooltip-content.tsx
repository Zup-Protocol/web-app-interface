"use client";

import { VirtualizedList } from "@/components/ui/virtualized-list";
import type { TokenBasket } from "@/core/types/token.types";
import { AddressFormatter } from "@/lib/address-formatter";
import { AppNetworksUtils } from "@/lib/app-networks";
import { ThemeMode } from "@/lib/theme-mode";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { AssetTooltipContent } from "./asset-tooltip-content";

export function BasketTooltipContent({
  basket,
  onClose,
}: {
  basket: TokenBasket;
  onClose?: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const sortedTokens = React.useMemo(
    () =>
      [...basket.tokens].sort(
        (a, b) =>
          a.symbol.localeCompare(b.symbol) || a.name.localeCompare(b.name),
      ),
    [basket.tokens],
  );

  return (
    <AssetTooltipContent
      title={basket.name}
      description={basket.description}
      onClose={onClose}
      containerRef={parentRef}
    >
      <VirtualizedList
        items={sortedTokens}
        parentRef={parentRef}
        estimateSize={() => 72}
        forceInternalScroll
        className="relative w-full"
        renderItem={(token, index, virtualItem) => {
          const networkValue = AppNetworksUtils.values.find(
            (n) => AppNetworksUtils.wagmiNetwork[n]?.id === token.chainId,
          );

          if (networkValue === undefined) return null;

          const networkName = AppNetworksUtils.networkName[networkValue];
          const logo = AppNetworksUtils.logoSvg[networkValue];
          const activeIcon =
            resolvedTheme === ThemeMode.DARK ? logo.dark : logo.light;

          const networkIconSrc =
            typeof activeIcon === "string"
              ? activeIcon
              : (activeIcon as any).src;
          const explorerUrl = AppNetworksUtils.getExplorerUrl(token.chainId);

          return (
            <motion.a
              href={`${explorerUrl}/address/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-4 h-full pb-[20px] rounded-xl transition-colors group cursor-pointer min-w-0"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-8 h-8 shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border border-border/10 bg-background/50 backdrop-blur-sm">
                    {token.logoUrl ? (
                      <img
                        src={token.logoUrl}
                        alt={token.symbol}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-medium bg-foreground/5">
                        {token.symbol[0]}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-background shadow-xs flex items-center justify-center overflow-hidden z-10">
                    <img
                      src={networkIconSrc}
                      alt={networkName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-base font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                    {token.symbol}
                  </span>
                  <span className="text-sm text-mutated-text mt-0.5 truncate group-hover:text-primary transition-colors">
                    {networkName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <span className="text-sm text-mutated-text group-hover:text-primary transition-colors">
                    {AddressFormatter.truncateAddress(token.address)}
                  </span>
                  <div className="absolute -bottom-0.5 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
                <ExternalLink
                  size={14}
                  className="text-mutated-text/40 group-hover:text-primary transition-colors"
                />
              </div>
            </motion.a>
          );
        }}
      />
    </AssetTooltipContent>
  );
}
