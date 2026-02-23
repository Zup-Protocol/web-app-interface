"use client";

import type {
  MultiChainToken,
  SingleChainToken,
} from "@/core/types/token.types";
import { AddressFormatter } from "@/lib/address-formatter";
import { AppNetworksUtils } from "@/lib/app-networks";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { AssetTooltipContent } from "./asset-tooltip-content";

interface TokenTooltipContentProps {
  token: SingleChainToken | MultiChainToken;
  onClose?: () => void;
}

export function TokenTooltipContent({
  token,
  onClose,
}: TokenTooltipContentProps) {
  const isMultiChain = token.type === "multi-chain";

  const rows = isMultiChain
    ? token.addresses || []
    : [
        {
          chainId: token.chainId,
          address: token.address,
        },
      ];

  if (!rows || rows.length === 0) return null;

  return (
    <AssetTooltipContent title="Contracts" onClose={onClose}>
      {rows.map((row) => {
        const networkValue = AppNetworksUtils.values.find(
          (n) => AppNetworksUtils.wagmiNetwork[n]?.id === row.chainId,
        );

        if (networkValue === undefined) return null;

        const networkName = AppNetworksUtils.networkName[networkValue];
        const logos = AppNetworksUtils.logoSvg[networkValue];
        const lightIcon = logos.light;
        const darkIcon = logos.dark;
        const lightSrc =
          typeof lightIcon === "string" ? lightIcon : (lightIcon as any).src;
        const darkSrc =
          typeof darkIcon === "string" ? darkIcon : (darkIcon as any).src;
        const explorerUrl = AppNetworksUtils.getExplorerUrl(row.chainId);

        return (
          <motion.a
            key={row.chainId}
            href={explorerUrl ? `${explorerUrl}/address/${row.address}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 32,
                },
              },
            }}
            className="flex items-center justify-between gap-5 pb-[20px] rounded-lg transition-colors group cursor-pointer"
            whileHover={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden flex items-center justify-center p-0.5">
                <img
                  src={lightSrc}
                  alt={networkName}
                  className="w-full h-full object-contain dark:hidden"
                />
                <img
                  src={darkSrc}
                  alt={networkName}
                  className="w-full h-full object-contain hidden dark:block"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-foreground leading-none group-hover:text-primary transition-colors">
                  {networkName}
                </span>
                <span className="text-sm text-mutated-text mt-1 group-hover:text-primary transition-colors">
                  {AddressFormatter.truncateAddress(row.address)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 transition-opacity">
              <ExternalLink
                size={14}
                className="text-mutated-text group-hover:text-primary transition-colors"
              />
            </div>
          </motion.a>
        );
      })}
    </AssetTooltipContent>
  );
}
