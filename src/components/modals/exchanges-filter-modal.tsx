"use client";

import type { SearchSettingsConfig } from "@/core/DTOs/search-settings-config.dto";
import { DEFAULT_SEARCH_SETTINGS } from "@/core/DTOs/search-settings-config.dto";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { CustomEvent } from "@/lib/custom-event";
import { LocalStorageKey } from "@/lib/local-storage-key";
import {
    SupportedDexs,
    SupportedDexsUtils,
    type DexMetadata,
} from "@/lib/supported-dexs";
import { AnimatePresence, m, type Variants } from "framer-motion";
import { Ban, CheckIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScaleClickAnimation } from "../ui/animations/scale-click-animation";
import { CloseButton } from "../ui/buttons/close-button";
import { Modal } from "../ui/modal";
import { SearchInput } from "../ui/search-input";
import { SegmentedControl } from "../ui/segmented-control";
import { StateDisplay } from "../ui/state-display";

import searchingBox from "@/assets/escalerin/escalerin-searching-box.svg";

interface ExchangesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExchangesFilterModal({
  isOpen,
  onClose,
}: ExchangesFilterModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="h-[90vh] sm:h-[600px] sm:max-h-[85vh] sm:max-w-[700px]"
    >
      {isOpen && <ExchangesFilterContent onClose={onClose} />}
    </Modal>
  );
}

function ExchangesFilterContent({ onClose }: { onClose: () => void }) {
  const { translate } = useTranslation();
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState<"all" | "enabled" | "disabled">(
    "all",
  );
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [search]);

  const [blockedExchanges, setBlockedExchanges] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(LocalStorageKey.SEARCH_SETTINGS);
      if (stored) {
        const config = JSON.parse(stored) as SearchSettingsConfig;
        return config.blockedExchanges || [];
      }
    } catch {}
    return [];
  });

  const allDexs = useMemo(
    () =>
      Object.entries(SupportedDexsUtils.metadata).sort(([, a], [, b]) =>
        a.name.localeCompare(b.name),
      ),
    [],
  );

  const filteredDexs = useMemo(() => {
    let result = allDexs;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(([, meta]) =>
        meta.name.toLowerCase().includes(lowerSearch),
      );
    }

    if (viewFilter === "enabled") {
      result = result.filter(([id]) => !blockedExchanges.includes(id));
    } else if (viewFilter === "disabled") {
      result = result.filter(([id]) => blockedExchanges.includes(id));
    }

    return result;
  }, [search, allDexs, blockedExchanges, viewFilter]);

  const updateSettings = (newBlocked: string[]) => {
    setBlockedExchanges(newBlocked);

    try {
      const stored = localStorage.getItem(LocalStorageKey.SEARCH_SETTINGS);
      const config: SearchSettingsConfig = stored
        ? JSON.parse(stored)
        : { ...DEFAULT_SEARCH_SETTINGS };

      config.blockedExchanges = newBlocked;

      localStorage.setItem(
        LocalStorageKey.SEARCH_SETTINGS,
        JSON.stringify(config),
      );
      window.dispatchEvent(new Event(CustomEvent.SEARCH_SETTINGS_CHANGED));
    } catch {}
  };

  const handleToggle = (dexId: string) => {
    const isCurrentlyBlocked = blockedExchanges.includes(dexId);
    let newBlocked: string[];

    if (isCurrentlyBlocked) {
      newBlocked = blockedExchanges.filter((id) => id !== dexId);
    } else {
      newBlocked = [...blockedExchanges, dexId];
    }
    updateSettings(newBlocked);
  };

  const visibleDexIds = filteredDexs.map(([id]) => id);
  const isAllVisibleSelected =
    visibleDexIds.length > 0 &&
    visibleDexIds.every((id) => !blockedExchanges.includes(id));

  const handleToggleAll = () => {
    if (isAllVisibleSelected) {
      const uniqueNewBlocked = Array.from(
        new Set([...blockedExchanges, ...visibleDexIds]),
      );
      updateSettings(uniqueNewBlocked);
    } else {
      const newBlocked = blockedExchanges.filter(
        (id) => !visibleDexIds.includes(id),
      );
      updateSettings(newBlocked);
    }
  };

  const isChecked = (dexId: string) => {
    return !blockedExchanges.includes(dexId);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: search ? 0 : 0.02,
        delayChildren: search ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <>
      <div className="absolute top-6 right-6 z-50">
        <CloseButton onClick={onClose} aria-label="Close" />
      </div>

      <div
        ref={listRef}
        className="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-modal/80"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex flex-col gap-1.5 pt-8 px-6 pb-6 bg-modal/80 backdrop-blur-md w-full">
          <h2 className="text-xl font-bold text-foreground flex items-center">
            {translate(AppTranslationsKeys.EXCHANGES_FILTER_MODAL_TITLE)}
            <span className="text-base text-mutated-text ml-2 font-medium">
              ({allDexs.length - blockedExchanges.length}/{allDexs.length})
            </span>
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            <SearchInput
              placeholder={translate(
                AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SEARCH_PLACEHOLDER,
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              containerClassName="w-full"
              debounceTime={200}
            />

            <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between gap-3">
              <SegmentedControl
                className="w-full min-[500px]:w-auto"
                value={viewFilter}
                onChange={setViewFilter}
                options={[
                  {
                    label: (
                      <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="leading-none">
                          {translate(
                            AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ALL,
                          )}
                        </span>
                        <span className="opacity-70 text-[11px] font-bold leading-none translate-y-[0.5px]">
                          {allDexs.length}
                        </span>
                      </div>
                    ),
                    value: "all",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="leading-none">
                          {translate(
                            AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ENABLED,
                          )}
                        </span>
                        <span className="opacity-70 text-[11px] font-bold leading-none translate-y-[0.5px]">
                          {allDexs.length - blockedExchanges.length}
                        </span>
                      </div>
                    ),
                    value: "enabled",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="leading-none">
                          {translate(
                            AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_DISABLED,
                          )}
                        </span>
                        <span className="opacity-70 text-[11px] font-bold leading-none translate-y-[0.5px]">
                          {blockedExchanges.length}
                        </span>
                      </div>
                    ),
                    value: "disabled",
                  },
                ]}
              />

              <ScaleClickAnimation scale={0.96}>
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="flex items-center justify-center gap-2 px-4 h-[40px] w-full min-[500px]:w-auto rounded-[12px] bg-tertiary-button-on-modal-background hover:bg-tertiary-button-on-modal-background-hover text-foreground outline-none group cursor-pointer whitespace-nowrap transition-colors"
                >
                  {isAllVisibleSelected ? (
                    <XIcon size={14} className="text-foreground" />
                  ) : (
                    <CheckIcon size={14} className="text-foreground" />
                  )}
                  <span className="font-medium">
                    {isAllVisibleSelected
                      ? translate(
                          AppTranslationsKeys.EXCHANGES_FILTER_MODAL_CLEAR_ALL,
                        )
                      : translate(
                          AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SELECT_ALL,
                        )}
                  </span>
                </button>
              </ScaleClickAnimation>
            </div>
          </div>
        </div>

        <div className="px-6 pt-2 pb-12">
          <p className="text text-mutated-text mb-6">
            {translate(AppTranslationsKeys.EXCHANGES_FILTER_MODAL_DESCRIPTION)}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            {filteredDexs.length > 0 ? (
              <m.div
                key="dex-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredDexs.map(([dex, meta]) => (
                    <RenderItem
                      key={dex}
                      meta={meta}
                      isChecked={isChecked(dex)}
                      onToggle={() => handleToggle(dex as SupportedDexs)}
                      variants={itemVariants}
                    />
                  ))}
                </AnimatePresence>
              </m.div>
            ) : (
              <m.div
                key="empty-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{
                  opacity: { duration: 0.4 },
                  y: { type: "spring", stiffness: 300, damping: 25 },
                }}
                className="pt-8 pb-20"
              >
                <StateDisplay
                  image={searchingBox}
                  title={translate(
                    AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_TITLE,
                  )}
                  description={translate(
                    AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_DESCRIPTION,
                  )}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function RenderItem({
  meta,
  isChecked,
  onToggle,
  variants,
}: {
  meta: DexMetadata;
  isChecked: boolean;
  onToggle: () => void;
  variants: Variants;
}) {
  return (
    <m.div
      layout="position"
      variants={variants}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 40,
        },
      }}
    >
      <ScaleClickAnimation
        scale={0.96}
        data-testid="dex-card"
        className="relative flex flex-col items-center justify-center gap-4 p-6 w-full aspect-square rounded-[22px] cursor-pointer group border border-outline-button-border-on-modal transition-[background-color,color,border-color] duration-300"
        style={{
          backgroundColor: meta.logoBackgroundColor,
          color: meta.textColorOnBackground,
        }}
        onClick={onToggle}
      >
        <div className="absolute top-4 right-4">
          <AnimatePresence mode="wait">
            {isChecked ? (
              <m.div
                key="checked"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"
              >
                <CheckIcon size={14} strokeWidth={3} className="text-black" />
              </m.div>
            ) : (
              <m.div
                key="unchecked"
                initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: -45 }}
                className="w-7 h-7 bg-[#FF4B4B] rounded-full flex items-center justify-center shadow-sm"
              >
                <Ban size={14} strokeWidth={3} className="text-white" />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-22 h-22 rounded-full overflow-hidden flex items-center justify-center shrink-0">
          <img
            src={meta.logo.src}
            alt={meta.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="h-10 flex items-center justify-center w-full">
          <span className="text-sm font-semibold text-center line-clamp-2 leading-tight">
            {meta.name}
          </span>
        </div>
      </ScaleClickAnimation>
    </m.div>
  );
}
