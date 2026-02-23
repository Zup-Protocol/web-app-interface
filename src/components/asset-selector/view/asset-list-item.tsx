"use client";

import { AssetLogo } from "@/components/ui/asset-logo";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import type { ReactNode } from "react";
import { ScaleHoverAnimation } from "../../ui/animations/scale-hover-animation";

interface AssetListItemProps {
  title: string;
  subtitle?: string;
  logoUrl?: string;
  assetName?: string;
  assetSymbol?: string;
  tooltipContent?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function AssetListItem({
  title,
  subtitle,
  logoUrl,
  assetName,
  assetSymbol,
  tooltipContent,
  onClick,
  disabled,
  className,
}: AssetListItemProps) {
  return (
    <ScaleHoverAnimation asChild scale={1.03} disabled={disabled}>
      <m.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex w-full items-center justify-between",
          "p-6 rounded-xl mb-4",
          "bg-tertiary-button-background hover:bg-tertiary-button-background-hover",
          "transition-colors duration-200",
          "text-left group cursor-pointer",
          disabled &&
            "opacity-40 cursor-not-allowed hover:bg-tertiary-button-background",
          className,
        )}
      >
        <div className="flex items-center gap-4 min-w-0">
          <AssetLogo
            url={logoUrl}
            name={assetName}
            symbol={assetSymbol}
            size={48}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-base font-semibold text-foreground truncate">
              {title}
            </span>
            {subtitle && (
              <span className="text-sm text-mutated-text truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {tooltipContent && (
          <div onClick={(e) => e.stopPropagation()}>
            <InfoTooltip
              content={tooltipContent}
              showModalOnMobile
              padding={0}
              className="w-10 h-10 md:w-auto md:h-auto"
              contentClassName={cn(
                "max-w-sm p-0",
                "w-full max-w-none md:max-w-sm",
              )}
            />
          </div>
        )}
      </m.button>
    </ScaleHoverAnimation>
  );
}
