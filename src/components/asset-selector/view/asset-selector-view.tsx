"use client";

import EscalerinDeadImage from "@/assets/escalerin/escalerin-dead.svg";
import UnknownTokenImage from "@/assets/escalerin/escalerin-unknown-token.svg";
import { AssetSelectorHeader } from "@/components/asset-selector/view/asset-selector-header";
import { BasketListItem } from "@/components/asset-selector/view/basket-list-item";
import { TokenListItem } from "@/components/asset-selector/view/token-list-item";
import { TabButton } from "@/components/ui/buttons/tab-button";
import { TextButton } from "@/components/ui/buttons/text-button";
import { RefreshIcon } from "@/components/ui/icons/refresh";
import { Skeleton } from "@/components/ui/skeleton";
import { StateDisplay } from "@/components/ui/state-display";
import { VirtualizedList } from "@/components/ui/virtualized-list";
import type {
  AssetSelectorSide,
  SelectableAsset,
} from "@/core/types/token.types";
import { useHydricBaskets } from "@/hooks/tokens/use-hydric-baskets";
import { useHydricTokens } from "@/hooks/tokens/use-hydric-tokens";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppNetwork } from "@/hooks/use-network";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppNetworksUtils } from "@/lib/app-networks";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { Blend, Coins, ShoppingBasket } from "lucide-react";
import * as React from "react";
import { useDebounce } from "use-debounce";

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

enum AssetFilter {
  ALL = "ALL",
  TOKENS = "TOKENS",
  BASKETS = "BASKETS",
}

export function AssetSelectorView({
  onBack,
  onSelect,
  onDeselect,
  currentSelectedAsset,
  otherSelectedAsset,
}: AssetSelectorViewProps) {
  const isMobile = useMediaQuery(ScreenBreakpoints.MOBILE);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { translate } = useTranslation();
  const [activeFilter, setActiveFilter] = React.useState<AssetFilter>(
    AssetFilter.ALL,
  );

  const filterOptions = React.useMemo(
    () => [
      {
        id: AssetFilter.ALL,
        label: AppTranslationsKeys.ASSET_SELECTOR_FILTER_ALL,
        Icon: Blend,
      },
      {
        id: AssetFilter.TOKENS,
        label: AppTranslationsKeys.ASSET_SELECTOR_FILTER_TOKENS,
        Icon: Coins,
      },
      {
        id: AssetFilter.BASKETS,
        label: AppTranslationsKeys.ASSET_SELECTOR_FILTER_BASKETS,
        Icon: ShoppingBasket,
      },
    ],
    [],
  );

  const { network } = useAppNetwork();
  const activeChainId = AppNetworksUtils.chainId[network];

  const { data: baskets, isLoading: isLoadingBaskets } =
    useHydricBaskets(activeChainId);

  const {
    data: tokensData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingTokens,
    error: tokensError,
    refetch: refetchTokens,
  } = useHydricTokens({
    chainId: activeChainId,
    search: debouncedSearchQuery,
  });

  useScrollLock({ enabled: isMobile });

  const handleSelect = (asset: SelectableAsset) => {
    inputRef.current?.blur();
    onSelect(asset);
  };

  const handleBack = () => {
    inputRef.current?.blur();
    onBack();
  };

  const isAssetDisabled = (asset: SelectableAsset) => {
    if (asset.type === "basket" || !otherSelectedAsset) return false;

    if (JSON.stringify(asset) === JSON.stringify(otherSelectedAsset)) {
      return true;
    }

    return false;
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

  // Combine data for display
  const allTokens = React.useMemo(() => tokensData?.tokens ?? [], [tokensData]);

  const filteredBaskets = React.useMemo(() => {
    if (debouncedSearchQuery) return [];
    if (activeFilter === AssetFilter.TOKENS) return [];
    return baskets ?? [];
  }, [baskets, debouncedSearchQuery, activeFilter]);

  const filteredTokens = React.useMemo(() => {
    if (activeFilter === AssetFilter.BASKETS && !debouncedSearchQuery)
      return [];
    return allTokens;
  }, [allTokens, debouncedSearchQuery, activeFilter]);

  const isEmpty =
    !isLoadingTokens &&
    !isLoadingBaskets &&
    filteredTokens.length === 0 &&
    (debouncedSearchQuery ? true : filteredBaskets.length === 0);

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

          <AnimatePresence>
            {!debouncedSearchQuery && (
              <m.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mx-auto w-full max-w-[500px] px-6 sm:px-0 overflow-hidden"
              >
                <LayoutGroup>
                  <div className="flex items-center gap-4">
                    {filterOptions.map(({ id, label, Icon }) => (
                      <TabButton
                        key={id}
                        isActive={activeFilter === id}
                        onClick={() => setActiveFilter(id)}
                        activeColor="primary"
                      >
                        <Icon size={18} />
                        {translate(label)}
                      </TabButton>
                    ))}
                  </div>
                </LayoutGroup>
              </m.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "w-full mx-auto px-6 sm:px-0 pt-0 pb-48",
              "max-w-[500px]",
            )}
          >
            <AnimatePresence mode="wait">
              {tokensError ? (
                <div className="py-12 flex items-center justify-center">
                  <StateDisplay
                    image={EscalerinDeadImage}
                    title={translate(
                      AppTranslationsKeys.ASSET_SELECTOR_ERROR_TITLE,
                    )}
                    description={translate(
                      AppTranslationsKeys.ASSET_SELECTOR_ERROR_DESCRIPTION,
                    )}
                    button={
                      <TextButton
                        icon={<RefreshIcon />}
                        onClick={() => refetchTokens()}
                      >
                        {translate(
                          AppTranslationsKeys.ASSET_SELECTOR_ERROR_RETRY,
                        )}
                      </TextButton>
                    }
                  />
                </div>
              ) : isEmpty ? (
                <EmptySearchStateView searchQuery={searchQuery} />
              ) : (
                <AssetListView
                  key={`asset-list-${activeFilter}`}
                  baskets={filteredBaskets}
                  tokens={filteredTokens}
                  onSelect={handleSelect}
                  isAssetDisabled={isAssetDisabled}
                  parentRef={parentRef}
                  onEndClose={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                      fetchNextPage();
                    }
                  }}
                  isLoading={
                    debouncedSearchQuery
                      ? isLoadingTokens
                      : isLoadingBaskets || isLoadingTokens
                  }
                  showBaskets={
                    activeFilter !== AssetFilter.TOKENS && !debouncedSearchQuery
                  }
                  isFetchingMore={isFetchingNextPage}
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

function AssetListView({
  baskets,
  tokens,
  onSelect,
  isAssetDisabled,
  parentRef,
  onEndClose,
  isLoading,
  showBaskets,
  isFetchingMore,
}: {
  baskets: SelectableAsset[];
  tokens: SelectableAsset[];
  onSelect: (asset: SelectableAsset) => void;
  isAssetDisabled: (asset: SelectableAsset) => boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onEndClose: () => void;
  isLoading: boolean;
  showBaskets: boolean;
  isFetchingMore: boolean;
}) {
  const { translate } = useTranslation();
  const items = React.useMemo(() => {
    const list: any[] = [];

    if (isLoading) {
      if (showBaskets) {
        list.push({
          type: "header",
          title: translate(AppTranslationsKeys.ASSET_SELECTOR_BASKETS_TITLE),
        });
        list.push({ type: "skeleton" });
        list.push({ type: "skeleton" });
      }

      list.push({
        type: "header",
        title: translate(AppTranslationsKeys.ASSET_SELECTOR_TOKENS_TITLE),
        isSecondary: showBaskets,
      });
      list.push({ type: "skeleton" });
      list.push({ type: "skeleton" });
      list.push({ type: "skeleton" });

      return list;
    }

    if (baskets.length > 0) {
      list.push({
        type: "header",
        title: translate(AppTranslationsKeys.ASSET_SELECTOR_BASKETS_TITLE),
      });
      baskets.forEach((basket) => list.push({ type: "basket", asset: basket }));
    }

    if (tokens.length > 0) {
      list.push({
        type: "header",
        title: translate(AppTranslationsKeys.ASSET_SELECTOR_TOKENS_TITLE),
        isSecondary: baskets.length > 0,
      });
      tokens.forEach((token) => list.push({ type: "token", asset: token }));
    }

    if (isFetchingMore) {
      list.push({ type: "skeleton" });
      list.push({ type: "skeleton" });
    }

    return list;
  }, [baskets, tokens, translate, isLoading, showBaskets, isFetchingMore]);

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col flex-1 min-h-0"
    >
      <VirtualizedList
        items={items}
        parentRef={parentRef}
        onEndClose={onEndClose}
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
                basket={item.asset}
                onClick={() => onSelect(item.asset)}
              />
            ) : item.type === "skeleton" ? (
              <div className="flex items-center gap-3 p-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-3" />
                </div>
              </div>
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
