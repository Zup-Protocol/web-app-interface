"use client";

import { TokenSelectorButton } from "@/components/positions/token-selector-button";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { CogIcon, type CogIconHandle } from "@/components/ui/icons/cog";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AnimationProvider } from "@/providers/animation-provider";
import { motion } from "framer-motion";
import { useRef } from "react";
import { SparklesIcon, type SparklesIconHandle } from "../ui/icons/sparkles";

export function NewPositionForm() {
  const { translate } = useTranslation();
  const searchSettingsIconRef = useRef<CogIconHandle>(null);
  const sparklesIconRef = useRef<SparklesIconHandle>(null);

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
              <PrimaryButton
                variant="outline"
                className="h-10 px-4"
                onMouseEnter={() =>
                  searchSettingsIconRef.current?.startAnimation()
                }
                onMouseLeave={() =>
                  searchSettingsIconRef.current?.stopAnimation()
                }
                icon={<CogIcon ref={searchSettingsIconRef} size={16} />}
                alwaysIcon
              >
                {translate(
                  AppTranslationsKeys.NEW_POSITION_SEARCH_SETTINGS_BUTTON,
                )}
              </PrimaryButton>
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
