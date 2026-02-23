"use client";

import {
    CursorClickIcon,
    type CursorClickIconHandle,
} from "@/components/ui/icons/cursor-click";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { AssetLogo } from "@/components/ui/asset-logo";
import type { SelectableAsset } from "@/core/types/token.types";
import { AnimatePresence } from "framer-motion";

interface AssetSelectorButtonProps {
  label: string;
  selectedAsset?: SelectableAsset;
  onClick?: () => void;
  className?: string;
  layoutId?: string;
}

export function AssetSelectorButton({
  label,
  selectedAsset,
  onClick,
  className,
  layoutId,
}: AssetSelectorButtonProps) {
  const { translate } = useTranslation();
  const [isHovered, setIsHovered] = React.useState(false);
  const iconRef = React.useRef<CursorClickIconHandle>(null);

  const displayLabel = selectedAsset
    ? selectedAsset.type === "basket"
      ? selectedAsset.name
      : selectedAsset.symbol
    : label;

  const displayLogo = selectedAsset?.logoUrl;
  // .replaceAll(
  //   "https://logos.hydric.org/",
  //   "http://localhost:8787/",
  // );

  return (
    <m.button
      type="button"
      onClick={onClick}
      onHoverStart={() => {
        setIsHovered(true);
        iconRef.current?.startAnimation();
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        iconRef.current?.stopAnimation();
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
      }}
      className={cn(
        "flex w-full items-center justify-between",
        "h-[100px]",
        "rounded-xl px-[24px] py-4",
        "bg-secondary-button-background hover:bg-secondary-button-background-hover",
        "text-primary font-medium text-left",
        "transition-colors duration-200",
        "cursor-pointer",
        selectedAsset &&
          "bg-tertiary-button-background hover:bg-tertiary-button-background-hover text-foreground",

        className,
      )}
    >
      <m.span
        layout="position"
        className="flex items-center gap-4 min-w-0 flex-1"
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        <AnimatePresence mode="wait">
          {selectedAsset ? (
            <AssetLogo
              key="asset-logo"
              url={selectedAsset.logoUrl}
              name={
                selectedAsset.type === "basket" ? selectedAsset.name : undefined
              }
              symbol={
                selectedAsset.type !== "basket"
                  ? selectedAsset.symbol
                  : undefined
              }
              size={40}
            />
          ) : (
            <m.div
              key="default-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <CursorClickIcon ref={iconRef} size={24} />
            </m.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col items-start min-w-0 flex-1 text-left">
          <m.span layout="position" className="truncate w-full font-semibold">
            {displayLabel}
          </m.span>
          {selectedAsset && (
            <span className="text-sm text-mutated-text tracking-wider font-medium mb-0.5 truncate w-full">
              {selectedAsset.type === "basket"
                ? translate(AppTranslationsKeys.NEW_POSITION_BASKET_LABEL)
                : selectedAsset.name}
            </span>
          )}
        </div>
      </m.span>
      <m.div
        animate={{ rotate: isHovered ? 180 : 0 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center opacity-60"
      >
        <ChevronDown className="h-5 w-5" />
      </m.div>
    </m.button>
  );
}
