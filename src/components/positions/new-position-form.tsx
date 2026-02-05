"use client";

import { SearchSettingsContent } from "@/components/positions/search-settings-content";
import { TokenSelectorButton } from "@/components/positions/token-selector-button";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { CogIcon, type CogIconHandle } from "@/components/ui/icons/cog";
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
import { AnimationProvider } from "@/providers/animation-provider";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SparklesIcon, type SparklesIconHandle } from "../ui/icons/sparkles";

export function NewPositionForm() {
  const { translate } = useTranslation();
  const searchSettingsIconRef = useRef<CogIconHandle>(null);
  const sparklesIconRef = useRef<SparklesIconHandle>(null);
  const [hasSearchSettingsChanges, setHasSearchSettingsChanges] =
    useState(false);

  useEffect(() => {
    const checkSettings = () => {
      try {
        const stored = localStorage.getItem(LocalStorageKey.SEARCH_SETTINGS);

        if (stored) {
          const config = JSON.parse(stored) as SearchSettingsConfig;
          const isDifferent =
            JSON.stringify(config) !== JSON.stringify(DEFAULT_SEARCH_SETTINGS);

          setHasSearchSettingsChanges(isDifferent);
        } else {
          setHasSearchSettingsChanges(false);
        }
      } catch {
        setHasSearchSettingsChanges(false);
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

  return (
    <AnimationProvider>
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

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <label className="text-sm text-mutated-text">
                {translate(AppTranslationsKeys.NEW_POSITION_TOKEN_A_LABEL)}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block relative">
                    <PrimaryButton
                      variant="outline"
                      className={`h-10 px-4 ${
                        hasSearchSettingsChanges
                          ? "text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
                          : ""
                      }`}
                      onMouseEnter={() =>
                        searchSettingsIconRef.current?.startAnimation()
                      }
                      onMouseLeave={() =>
                        searchSettingsIconRef.current?.stopAnimation()
                      }
                      icon={
                        <div className="relative">
                          <CogIcon ref={searchSettingsIconRef} size={16} />
                          {hasSearchSettingsChanges && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                          )}
                        </div>
                      }
                      alwaysIcon
                    >
                      {translate(
                        AppTranslationsKeys.NEW_POSITION_SEARCH_SETTINGS_BUTTON,
                      )}
                    </PrimaryButton>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[280px] p-4">
                  <SearchSettingsContent />
                </PopoverContent>
              </Popover>
            </div>
            <TokenSelectorButton
              label={translate(AppTranslationsKeys.NEW_POSITION_SELECT_TOKEN)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-mutated-text">
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
