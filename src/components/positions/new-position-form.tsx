"use client";

import { ExchangesFilterModal } from "@/components/modals/exchanges-filter-modal";
import { SearchSettingsContent } from "@/components/positions/search-settings-content";
import { TokenSelectorButton } from "@/components/positions/token-selector-button";
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
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { PrimaryButton } from "../ui/buttons/primary-button";
import { CogIcon } from "../ui/icons/cog";
import { SparklesIcon, type SparklesIconHandle } from "../ui/icons/sparkles";

export function NewPositionForm() {
  const { translate } = useTranslation();
  const searchSettingsIconRef = useRef<SlidersHorizontalIconHandle>(null);
  const sparklesIconRef = useRef<SparklesIconHandle>(null);
  const [hasSearchSettingsChanges, setHasSearchSettingsChanges] =
    useState(false);
  const [blockedExchangesCount, setBlockedExchangesCount] = useState(0);
  const [isExchangesModalOpen, setIsExchangesModalOpen] = useState(false);
  const [isSearchSettingsOpen, setIsSearchSettingsOpen] = useState(false);

  useEffect(() => {
    const checkSettings = () => {
      try {
        const stored = localStorage.getItem(LocalStorageKey.SEARCH_SETTINGS);
        if (!stored) {
          setHasSearchSettingsChanges(false);
          setBlockedExchangesCount(0);
          return;
        }

        const config = JSON.parse(stored) as SearchSettingsConfig;

        const hasChanges = (
          Object.keys(DEFAULT_SEARCH_SETTINGS) as Array<
            keyof SearchSettingsConfig
          >
        ).some((key) => {
          if (key === "blockedExchanges") return false;
          return config[key] !== DEFAULT_SEARCH_SETTINGS[key];
        });

        setHasSearchSettingsChanges(hasChanges);

        const blocked = config.blockedExchanges || [];
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

  return (
    <AnimationProvider>
      <ExchangesFilterModal
        isOpen={isExchangesModalOpen}
        onClose={() => setIsExchangesModalOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="flex flex-col gap-6 w-full max-w-lg"
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
                {translate(AppTranslationsKeys.NEW_POSITION_TOKEN_A_LABEL)}
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
                    if (isExchangesModalOpen) {
                      e.preventDefault();
                    }
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
            <TokenSelectorButton
              label={translate(AppTranslationsKeys.NEW_POSITION_SELECT_TOKEN)}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-sm text-mutated-text leading-none">
              {translate(AppTranslationsKeys.NEW_POSITION_TOKEN_B_LABEL)}
            </label>
            <TokenSelectorButton
              label={translate(AppTranslationsKeys.NEW_POSITION_SELECT_TOKEN)}
            />
          </div>
        </div>

        <PrimaryButton
          variant="disabled"
          className="h-12 text-base"
          onMouseEnter={() => sparklesIconRef.current?.startAnimation()}
          onMouseLeave={() => sparklesIconRef.current?.stopAnimation()}
          icon={<SparklesIcon ref={sparklesIconRef} size={18} />}
          alwaysIcon
        >
          {translate(AppTranslationsKeys.NEW_POSITION_SEARCH_BUTTON)}
        </PrimaryButton>
      </motion.div>
    </AnimationProvider>
  );
}
