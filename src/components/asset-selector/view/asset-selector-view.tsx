"use client";

import UnknownTokenImage from "@/assets/escalerin/escalerin-unknown-token.svg";
import { AssetSelectorHeader } from "@/components/asset-selector/view/asset-selector-header";
import { BasketListItem } from "@/components/asset-selector/view/basket-list-item";
import { TokenListItem } from "@/components/asset-selector/view/token-list-item";
import { StateDisplay } from "@/components/ui/state-display";
import { VirtualizedList } from "@/components/ui/virtualized-list";
import type {
  AssetSelectorSide,
  SelectableAsset,
} from "@/core/types/token.types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import {
  MOCK_SEARCH_RESULTS,
  POPULAR_TOKENS,
  TOKEN_BASKETS,
} from "@/lib/fixtures/token-fixtures";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import * as React from "react";

interface AssetSelectorViewProps {
  onBack: () => void;
  onSelect: (asset: SelectableAsset) => void;
  onDeselect: () => void;
  side: AssetSelectorSide;
  currentSelectedAsset?: SelectableAsset;
  otherSelectedAsset?: SelectableAsset;
  layoutId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 32 },
  },
};

export function AssetSelectorView({
  onBack,
  onSelect,
  onDeselect,
  currentSelectedAsset,
  otherSelectedAsset,
}: AssetSelectorViewProps) {
  const isMobile = useMediaQuery(ScreenBreakpoints.MOBILE);
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);

  useScrollLock({ enabled: isMobile });

  const filteredAssets =
    searchQuery.length > 0
      ? MOCK_SEARCH_RESULTS.filter(
          (asset) =>
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (asset.type !== "basket" &&
              asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : null;

  const handleSelect = (asset: SelectableAsset) => {
    inputRef.current?.blur();
    onSelect(asset);
  };

  const handleBack = () => {
    inputRef.current?.blur();
    onBack();
  };

  const isAssetDisabled = (asset: SelectableAsset) => {
    return asset === otherSelectedAsset && asset.type !== "basket";
  };

  const headerProps = {
    onBack: handleBack,
    searchQuery,
    onSearchChange: setSearchQuery,
    onSearchClear: () => setSearchQuery(""),
    currentSelectedAsset,
    onDeselect,
    inputRef,
  };

  return (
    <>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          pointerEvents: "none",
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 45,
            opacity: { duration: 0.1 },
          },
        }}
        className="flex flex-col w-full min-h-dvh bg-background fixed inset-0 z-150 overflow-y-auto sm:overflow-visible sm:relative sm:inset-auto sm:z-auto sm:min-h-0 sm:bg-background/90 sm:backdrop-blur-sm sm:rounded-3xl"
        ref={parentRef}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.15 },
        }}
      >
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.15 }}
          className="flex flex-col flex-1"
        >
          <div className="sticky top-0 z-1000 mb-4">
            <AssetSelectorHeader {...headerProps} />
          </div>

          <div
            className={cn(
              "w-full mx-auto px-6 sm:px-0 pt-0 pb-48",
              "max-w-[500px]",
            )}
          >
            <AnimatePresence mode="wait">
              {filteredAssets ? (
                filteredAssets.length > 0 ? (
                  <SearchResultsView
                    assets={filteredAssets}
                    onSelect={handleSelect}
                    isAssetDisabled={isAssetDisabled}
                    parentRef={parentRef}
                  />
                ) : (
                  <EmptySearchStateView searchQuery={searchQuery} />
                )
              ) : (
                <DefaultView
                  onSelect={handleSelect}
                  isAssetDisabled={isAssetDisabled}
                  parentRef={parentRef}
                />
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </m.div>

      {/* Infinite Scroll Gradient Overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background via-background/60 to-transparent pointer-events-none z-200" />
    </>
  );
}

function SearchResultsView({
  assets,
  onSelect,
  isAssetDisabled,
  parentRef,
}: {
  assets: SelectableAsset[];
  onSelect: (asset: SelectableAsset) => void;
  isAssetDisabled: (asset: SelectableAsset) => boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { translate } = useTranslation();

  const items = React.useMemo(
    () => [
      {
        type: "header" as const,
        title: translate(
          AppTranslationsKeys.ASSET_SELECTOR_SEARCH_RESULTS_TITLE,
        ),
      },
      ...assets.map((asset) => ({ type: "asset" as const, asset })),
    ],
    [assets, translate],
  );

  const headerHeight = 32;
  const itemHeight = 108;

  return (
    <m.div
      key="search-results"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col flex-1 min-h-0"
    >
      <VirtualizedList
        items={items}
        parentRef={parentRef}
        estimateSize={(index) => {
          return items[index].type === "header" ? headerHeight : itemHeight;
        }}
        renderItem={(item) => (
          <m.div
            initial="hidden"
            animate="show"
            variants={itemVariants}
            className="px-0 h-full"
          >
            {item.type === "header" ? (
              <h3 className="text-sm font-semibold text-mutated-text py-2">
                {item.title}
              </h3>
            ) : item.asset.type === "basket" ? (
              <BasketListItem
                basket={item.asset}
                onClick={() => onSelect(item.asset)}
              />
            ) : (
              <TokenListItem
                token={item.asset}
                onClick={() => onSelect(item.asset)}
                disabled={isAssetDisabled(item.asset)}
              />
            )}
          </m.div>
        )}
      />
    </m.div>
  );
}

function EmptySearchStateView({ searchQuery }: { searchQuery: string }) {
  const { translate } = useTranslation();

  return (
    <m.div
      key="empty-state"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="py-12 flex items-center justify-center"
    >
      <StateDisplay
        image={UnknownTokenImage}
        title={translate(AppTranslationsKeys.ASSET_SELECTOR_EMPTY_TITLE)}
        description={translate(
          AppTranslationsKeys.ASSET_SELECTOR_EMPTY_DESCRIPTION,
        ).replace("{query}", searchQuery)}
      />
    </m.div>
  );
}

function DefaultView({
  onSelect,
  isAssetDisabled,
  parentRef,
}: {
  onSelect: (asset: SelectableAsset) => void;
  isAssetDisabled: (asset: SelectableAsset) => boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { translate } = useTranslation();

  const items = React.useMemo(
    () => [
      {
        type: "header" as const,
        title: translate(AppTranslationsKeys.ASSET_SELECTOR_BASKETS_TITLE),
      },
      ...TOKEN_BASKETS.map((basket) => ({ type: "basket" as const, basket })),
      {
        type: "header" as const,
        title: translate(AppTranslationsKeys.ASSET_SELECTOR_TOKENS_TITLE),
        isSecondary: true,
      },
      ...POPULAR_TOKENS.map((token) => ({ type: "token" as const, token })),
    ],
    [translate],
  );

  return (
    <m.div
      key="default-view"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col flex-1 min-h-0"
    >
      <VirtualizedList
        items={items}
        parentRef={parentRef}
        estimateSize={(index) => {
          const item = items[index];
          if (item.type === "header") return item.isSecondary ? 72 : 56;

          return 108;
        }}
        renderItem={(item) => (
          <m.div
            initial="hidden"
            animate="show"
            variants={itemVariants}
            className="h-full"
          >
            {item.type === "header" ? (
              <h3
                className={cn(
                  "font-semibold text-mutated-text pb-4 text-[16px]",
                  item.isSecondary ? "pt-8" : "pt-4",
                )}
              >
                {item.title}
              </h3>
            ) : item.type === "basket" ? (
              <BasketListItem
                basket={item.basket}
                onClick={() => onSelect(item.basket)}
              />
            ) : (
              <TokenListItem
                token={item.token}
                onClick={() => onSelect(item.token)}
                disabled={isAssetDisabled(item.token)}
              />
            )}
          </m.div>
        )}
      />
    </m.div>
  );
}
