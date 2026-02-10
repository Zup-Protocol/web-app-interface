"use client";

import { AssetSelectorButton } from "@/components/asset-selector/asset-selector-button";
import { ExchangesFilterModal } from "@/components/modals/exchanges-filter-modal";
import { SearchSettingsContent } from "@/components/new-position/search-settings-content";
import { type SlidersHorizontalIconHandle } from "@/components/ui/icons/sliders";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DEFAULT_SEARCH_SETTINGS,
  type SearchSettingsConfig,
} from "@/core/DTOs/search-settings-config.dto";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { CustomEvent } from "@/lib/custom-event";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { SupportedDexsUtils } from "@/lib/supported-dexs";
import { cn } from "@/lib/utils";
import { AnimationProvider } from "@/providers/animation-provider";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { PrimaryButton } from "../ui/buttons/primary-button";
import { CogIcon } from "../ui/icons/cog";
import { SparklesIcon, type SparklesIconHandle } from "../ui/icons/sparkles";

import { AssetSelectorView } from "@/components/asset-selector/view/asset-selector-view";
import {
  type AssetSelectorSide,
  type SelectableAsset,
} from "@/core/types/token.types";

export function NewPositionForm() {
  const { translate } = useTranslation();
  const searchSettingsIconRef = useRef<SlidersHorizontalIconHandle>(null);
  const sparklesIconRef = useRef<SparklesIconHandle>(null);
  const [hasSearchSettingsChanges, setHasSearchSettingsChanges] =
    useState(false);
  const [blockedExchangesCount, setBlockedExchangesCount] = useState(0);
  const [isExchangesModalOpen, setIsExchangesModalOpen] = useState(false);
  const [isSearchSettingsOpen, setIsSearchSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);
  const [selectingSide, setSelectingSide] = useState<AssetSelectorSide | null>(
    null,
  );
  const [assetA, setAssetA] = useState<SelectableAsset | undefined>();
  const [assetB, setAssetB] = useState<SelectableAsset | undefined>();

  useEffect(() => {
    const checkSettings = () => {
      try {
        const stored = localStorage.getItem(LocalStorageKey.SEARCH_SETTINGS);

        if (!stored) {
          setHasSearchSettingsChanges(false);
          setBlockedExchangesCount(0);
          return;
        }

        const currentConfig = JSON.parse(stored) as SearchSettingsConfig;

        const hasChanges = (
          Object.keys(DEFAULT_SEARCH_SETTINGS) as Array<
            keyof SearchSettingsConfig
          >
        ).some((key) => {
          if (key === "blockedExchanges") return false;

          return currentConfig[key] !== DEFAULT_SEARCH_SETTINGS[key];
        });

        setHasSearchSettingsChanges(hasChanges);

        const blocked = currentConfig.blockedExchanges || [];
        setBlockedExchangesCount(blocked.length);
      } catch {
        setHasSearchSettingsChanges(false);
        setBlockedExchangesCount(0);
      }
    };

    checkSettings();

    window.addEventListener(CustomEvent.SEARCH_SETTINGS_CHANGED, checkSettings);
    return () => {
      window.removeEventListener(
        CustomEvent.SEARCH_SETTINGS_CHANGED,
        checkSettings,
      );
    };
  }, []);
  const totalDexs = SupportedDexsUtils.count;
  const isSomeBlocked = blockedExchangesCount > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [isAssetSelectorOpen]);

  const handleOpenAssetSelector = (side: AssetSelectorSide) => {
    setSelectingSide(side);
    setIsAssetSelectorOpen(true);
  };

  const handleSelectAsset = (asset: SelectableAsset) => {
    if (selectingSide === "A") setAssetA(asset);
    else setAssetB(asset);

    setIsAssetSelectorOpen(false);
  };

  const handleDeselectAsset = () => {
    if (selectingSide === "A") setAssetA(undefined);
    else setAssetB(undefined);

    setIsAssetSelectorOpen(false);
  };

  const isFormReady = !!assetA && !!assetB;

  return (
    <AnimationProvider>
      <ExchangesFilterModal
        isOpen={isExchangesModalOpen}
        onClose={() => setIsExchangesModalOpen(false)}
      />

      <m.div
        transition={{ type: "spring", stiffness: 120, damping: 25 }}
        className="relative w-full min-h-screen"
      >
        <AnimatePresence mode="popLayout">
          {!isAssetSelectorOpen ? (
            <m.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 25,
                delay: isMounted ? 0 : 0.6,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { type: "spring", stiffness: 500, damping: 45 },
              }}
              className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4 sm:px-0"
            >
              <header className="flex flex-col gap-2">
                <h1 className="text-[28px] font-semibold text-foreground">
                  {translate(AppTranslationsKeys.NEW_POSITION_TITLE)}
                </h1>
                <p className="text-mutated-text">
                  {translate(AppTranslationsKeys.NEW_POSITION_DESCRIPTION)}
                </p>
              </header>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-end justify-between">
                    <label className="text-sm text-mutated-text shrink-0 leading-none pb-[3px]">
                      {translate(
                        AppTranslationsKeys.NEW_POSITION_ASSET_A_LABEL,
                      )}
                    </label>
                    <Popover
                      open={isSearchSettingsOpen}
                      onOpenChange={setIsSearchSettingsOpen}
                    >
                      <PopoverTrigger asChild>
                        <button
                          aria-label="Search Settings"
                          className="relative flex items-center justify-center p-2 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer outline-none group"
                          onMouseEnter={() =>
                            searchSettingsIconRef.current?.startAnimation()
                          }
                          onMouseLeave={() =>
                            searchSettingsIconRef.current?.stopAnimation()
                          }
                        >
                          <div className="relative">
                            <CogIcon
                              ref={searchSettingsIconRef}
                              size={22}
                              className={cn(
                                "transition-colors",
                                hasSearchSettingsChanges || isSomeBlocked
                                  ? "text-orange-400"
                                  : "text-mutated-text group-hover:text-foreground",
                              )}
                            />
                            <AnimatePresence>
                              {(hasSearchSettingsChanges || isSomeBlocked) && (
                                <Badge className="-top-0.5 -right-0.5 w-2 h-2" />
                              )}
                            </AnimatePresence>
                          </div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-[280px] p-4"
                        onInteractOutside={(e) => {
                          if (isExchangesModalOpen) e.preventDefault();
                        }}
                      >
                        <SearchSettingsContent
                          onDone={() => setIsSearchSettingsOpen(false)}
                          onExchangesClick={() => setIsExchangesModalOpen(true)}
                          blockedExchangesCount={blockedExchangesCount}
                          totalExchangesCount={totalDexs}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <AssetSelectorButton
                    layoutId="asset-selector-A"
                    label={translate(
                      AppTranslationsKeys.NEW_POSITION_SELECT_ASSET,
                    )}
                    selectedAsset={assetA}
                    onClick={() => handleOpenAssetSelector("A")}
                  />
                </div>

                <div className="flex flex-col gap-[10px]">
                  <label className="text-sm text-mutated-text leading-none">
                    {translate(AppTranslationsKeys.NEW_POSITION_ASSET_B_LABEL)}
                  </label>
                  <AssetSelectorButton
                    layoutId="asset-selector-B"
                    label={translate(
                      AppTranslationsKeys.NEW_POSITION_SELECT_ASSET,
                    )}
                    selectedAsset={assetB}
                    onClick={() => handleOpenAssetSelector("B")}
                  />
                </div>
              </div>

              <PrimaryButton
                variant={isFormReady ? "default" : "disabled"}
                className="h-12 text-base"
                onMouseEnter={() => sparklesIconRef.current?.startAnimation()}
                onMouseLeave={() => sparklesIconRef.current?.stopAnimation()}
                icon={<SparklesIcon ref={sparklesIconRef} size={18} />}
                alwaysIcon
              >
                {translate(AppTranslationsKeys.NEW_POSITION_SEARCH_BUTTON)}
              </PrimaryButton>
            </m.div>
          ) : (
            <m.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                pointerEvents: "none",
                transition: {
                  layout: { type: "spring", stiffness: 500, damping: 45 },
                  opacity: { duration: 0.1 },
                },
              }}
              className="relative z-100 w-full"
            >
              <AssetSelectorView
                onBack={() => setIsAssetSelectorOpen(false)}
                onSelect={handleSelectAsset}
                onDeselect={handleDeselectAsset}
                side={selectingSide || "A"}
                currentSelectedAsset={selectingSide === "A" ? assetA : assetB}
                otherSelectedAsset={selectingSide === "A" ? assetB : assetA}
              />
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </AnimationProvider>
  );
}
