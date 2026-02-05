"use client";

import { UsdInput } from "@/components/ui/usd-input";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { CustomEvent } from "@/lib/custom-event";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { AnimationProvider } from "@/providers/animation-provider";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "../ui/buttons/primary-button";
import { InfoTooltip } from "../ui/info-tooltip";

import {
  DEFAULT_SEARCH_SETTINGS,
  type SearchSettingsConfig,
} from "@/core/DTOs/search-settings-config.dto";
import { DeleteIcon, type DeleteIconHandle } from "../ui/icons/trash";

export function SearchSettingsContent() {
  const { translate } = useTranslation();
  const deleteIconRef = useRef<DeleteIconHandle>(null);
  const [minLiquidity, setMinLiquidity] = useState<string>(
    DEFAULT_SEARCH_SETTINGS.minLiquidity,
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LocalStorageKey.SEARCH_SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchSettingsConfig;
        if (parsed.minLiquidity !== undefined) {
          setMinLiquidity(parsed.minLiquidity);
        }
      }
    } catch {
      setMinLiquidity(DEFAULT_SEARCH_SETTINGS.minLiquidity);
    }
  }, []);

  const handleMinLiquidityChange = (value: string) => {
    setMinLiquidity(value);

    const newConfig: SearchSettingsConfig = {
      minLiquidity: value,
    };

    localStorage.setItem(
      LocalStorageKey.SEARCH_SETTINGS,
      JSON.stringify(newConfig),
    );

    window.dispatchEvent(new Event(CustomEvent.SEARCH_SETTINGS_CHANGED));
  };

  return (
    <AnimationProvider>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="font-medium">
                {translate(
                  AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TITLE,
                )}
              </h2>
              <InfoTooltip
                content={translate(
                  AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TOOLTIP,
                )}
              />
            </div>
            {minLiquidity !== DEFAULT_SEARCH_SETTINGS.minLiquidity && (
              <button
                onClick={() =>
                  handleMinLiquidityChange(DEFAULT_SEARCH_SETTINGS.minLiquidity)
                }
                className="text-mutated-text hover:text-foreground transition-colors cursor-pointer outline-none"
                type="button"
                onMouseEnter={() => deleteIconRef.current?.startAnimation()}
                onMouseLeave={() => deleteIconRef.current?.stopAnimation()}
              >
                <DeleteIcon ref={deleteIconRef} size={16} />
              </button>
            )}
          </div>
          <UsdInput
            value={minLiquidity}
            onValueChange={handleMinLiquidityChange}
            placeholder="0"
          />
          <AnimatePresence>
            {Number(minLiquidity) <
              Number(DEFAULT_SEARCH_SETTINGS.minLiquidity) && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="text-yellow-500 font-medium overflow-hidden"
              >
                {translate(
                  AppTranslationsKeys.SEARCH_SETTINGS_LOW_LIQUIDITY_WARNING,
                )}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <PrimaryButton variant="outline" className="h-10">
          {translate(
            AppTranslationsKeys.SEARCH_SETTINGS_FILTER_EXCHANGES_BUTTON,
          )}
        </PrimaryButton>
      </div>
    </AnimationProvider>
  );
}
