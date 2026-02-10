"use client";

import { DeleteIcon } from "@/components/ui/icons/trash";
import { SearchInput } from "@/components/ui/search-input";
import type { SelectableAsset } from "@/core/types/token.types";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import * as React from "react";

interface AssetSelectorHeaderProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  currentSelectedAsset?: SelectableAsset;
  onDeselect: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function AssetSelectorHeader({
  onBack,
  searchQuery,
  onSearchChange,
  onSearchClear,
  currentSelectedAsset,
  onDeselect,
  inputRef,
}: AssetSelectorHeaderProps) {
  const { translate } = useTranslation();

  return (
    <div className="bg-background/80 backdrop-blur-md w-full py-[11px] pointer-events-auto">
      <div
        className={cn(
          "w-full flex items-center gap-4 mx-auto px-6 sm:px-0",
          "max-w-[500px]",
        )}
      >
        <m.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="p-3 rounded-xl bg-tertiary-button-background hover:bg-tertiary-button-background-hover transition-colors cursor-pointer group shrink-0"
        >
          <ArrowLeft
            size={20}
            className="text-foreground group-hover:-translate-x-0.5 transition-transform"
          />
        </m.button>

        <div className="flex-1">
          <SearchInput
            ref={inputRef}
            placeholder={translate(
              AppTranslationsKeys.ASSET_SELECTOR_SEARCH_PLACEHOLDER,
            )}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={onSearchClear}
            className="bg-foreground/3 border-foreground/8 h-[48px] text-base rounded-xl"
            autoFocus={true}
          />
        </div>

        {currentSelectedAsset && (
          <m.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onDeselect}
            className="p-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors cursor-pointer group shrink-0"
          >
            <DeleteIcon size={20} className="text-destructive" />
          </m.button>
        )}
      </div>
    </div>
  );
}
