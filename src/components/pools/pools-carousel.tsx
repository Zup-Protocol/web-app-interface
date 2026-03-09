import EscalerinDeadImage from "@/assets/escalerin/escalerin-dead.svg";
import EscalerinSadMistakeImage from "@/assets/escalerin/escalerin-sad-mistake.svg";
import EscalerinSearchingBoxImage from "@/assets/escalerin/escalerin-searching-box.svg";
import PoolRingSVG from "@/assets/svg/pool-ring.svg";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { TextButton } from "@/components/ui/buttons/text-button";
import { ArrowLeftIcon, type ArrowLeftIconHandle } from "@/components/ui/icons/arrow-left";
import { ArrowRightIcon, type ArrowRightIconHandle } from "@/components/ui/icons/arrow-right";
import { RefreshIcon } from "@/components/ui/icons/refresh";
import { LoadingText } from "@/components/ui/loading-text";
import { PageCounter } from "@/components/ui/page-counter";
import { StateDisplay } from "@/components/ui/state-display";
import { StateDisplayCard } from "@/components/ui/state-display-card";
import { YieldPeriod } from "@/core/enums/yield-period";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { type LiquidityPool } from "@hydric/gateway";
import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PoolCard, PoolCardConstants } from "./pool-card";

const DESKTOP_GAP = 32;
const DESKTOP_STRIDE = PoolCardConstants.WIDTH * 2 + DESKTOP_GAP;
const PREFETCH_THRESHOLD = 680;

type CarouselItem =
  | { type: "pool"; pool: LiquidityPool }
  | { type: "loader"; id: string }
  | { type: "error"; id: string }
  | { type: "no-more"; id: string }
  | { type: "empty"; id: string };

export function PoolsCarousel({
  pools,
  isLoading: isFirstLoad,
  isError: didPoolsRequestFailed,
  isFetching: isPoolsRequestInFlight,
  refetch,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  yieldPeriod,
}: {
  pools: LiquidityPool[];
  isLoading: boolean;
  isError?: boolean;
  isFetching?: boolean;
  refetch?: () => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  yieldPeriod: YieldPeriod;
}) {
  const { translate } = useTranslation();
  const isDesktop = useMediaQuery(ScreenBreakpoints.DESKTOP);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const backPageControllerIconRef = useRef<ArrowLeftIconHandle>(null);
  const nextPageControllerIconRef = useRef<ArrowRightIconHandle>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const isAutoScrollingRef = useRef(false);
  const isPageIndicatorNavigationRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerAutoScroll = (targetPage: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let targetScroll = 0;

    if (isDesktop) {
      targetScroll = targetPage * DESKTOP_STRIDE;
    } else {
      // On mobile, calculate stride based on children if possible to avoid drift
      const children = container.children;
      if (children.length > 1) {
        const stride = (children[1] as HTMLElement).offsetLeft - (children[0] as HTMLElement).offsetLeft;
        targetScroll = targetPage * stride;
      } else {
        targetScroll = targetPage * container.clientWidth;
      }
    }

    isAutoScrollingRef.current = true;
    setCurrentPage(targetPage);

    const scrollBehaviour: ScrollBehavior = isPageIndicatorNavigationRef.current ? "auto" : "smooth";

    container.scrollTo({
      left: targetScroll,
      behavior: scrollBehaviour,
    });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(
      () => {
        isAutoScrollingRef.current = false;
        isPageIndicatorNavigationRef.current = false;
      },
      scrollBehaviour === "auto" ? 800 : 800,
    );

    evaluateNextPageFetch({
      scrollLeft: targetScroll,
      clientWidth: container.clientWidth,
      scrollWidth: container.scrollWidth,
    });
  };

  const scrollLeft = () => {
    isPageIndicatorNavigationRef.current = false;
    const targetPage = Math.max(0, currentPage - 1);
    triggerAutoScroll(targetPage);
  };

  const scrollRight = () => {
    isPageIndicatorNavigationRef.current = false;
    const itemsLen = Math.ceil(items.length / 2);
    const targetPage = Math.min(itemsLen - 1, currentPage + 1);
    triggerAutoScroll(targetPage);
  };

  const handlePageIndicatorNavigation = (page: number) => {
    isPageIndicatorNavigationRef.current = true;
    triggerAutoScroll(page);
  };

  const evaluateNextPageFetch = ({ scrollLeft, clientWidth, scrollWidth }: { scrollLeft: number; clientWidth: number; scrollWidth: number }) => {
    if (!hasNextPage || isFetchingNextPage || didPoolsRequestFailed) return;

    const threshold = isDesktop ? PREFETCH_THRESHOLD : clientWidth;
    const isNearEnd = scrollLeft + clientWidth >= scrollWidth - threshold;

    if (isNearEnd) fetchNextPage();
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      let page = 0;

      if (isDesktop) {
        page = Math.round(container.scrollLeft / DESKTOP_STRIDE);
      } else {
        const children = container.children;

        if (children.length > 1) {
          const stride = (children[1] as HTMLElement).offsetLeft - (children[0] as HTMLElement).offsetLeft;
          page = Math.round(container.scrollLeft / stride);
        } else {
          page = Math.round(container.scrollLeft / container.clientWidth);
        }
      }

      if (isAutoScrollingRef.current) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 150);
      } else if (page !== currentPage) {
        isPageIndicatorNavigationRef.current = false; // Manual swipes are never "jumps"
        setCurrentPage(page);
      }

      evaluateNextPageFetch({
        scrollLeft: container.scrollLeft,
        clientWidth: container.clientWidth,
        scrollWidth: container.scrollWidth,
      });
    }
  };

  if ((isFirstLoad || isPoolsRequestInFlight) && pools.length === 0) {
    return (
      <div className="flex gap-4 overflow-hidden px-4 w-full justify-center pt-[120px] pb-8 min-h-[200px] items-start">
        <LoadingText text={translate(AppTranslationsKeys.POOLS_CAROUSEL_LOADING)} />
      </div>
    );
  }

  if (didPoolsRequestFailed && pools.length === 0) {
    return (
      <div className="flex w-full justify-center py-5">
        <StateDisplayCard
          image={EscalerinSadMistakeImage}
          title={translate(AppTranslationsKeys.POOLS_CAROUSEL_ERROR_TITLE)}
          description={translate(AppTranslationsKeys.POOLS_CAROUSEL_ERROR_DESCRIPTION)}
          className="max-w-[648px]"
          action={
            <TextButton icon={<RefreshIcon />} onClick={() => refetch?.()}>
              {translate(AppTranslationsKeys.POOLS_CAROUSEL_TRY_AGAIN)}
            </TextButton>
          }
        />
      </div>
    );
  }

  if (!isFirstLoad && !didPoolsRequestFailed && pools.length === 0) {
    return (
      <div className="flex w-full justify-center py-12">
        <StateDisplay
          image={EscalerinSearchingBoxImage}
          title={translate(AppTranslationsKeys.POOLS_CAROUSEL_EMPTY_TITLE)}
          description={translate(AppTranslationsKeys.POOLS_CAROUSEL_EMPTY_DESCRIPTION)}
        />
      </div>
    );
  }

  const items: CarouselItem[] = pools.map((pool) => ({ type: "pool", pool }));

  if (isFetchingNextPage) {
    if (pools.length % 2 !== 0) {
      items.push({ type: "loader", id: "loader-1" });
    } else {
      items.push({ type: "loader", id: "loader-1" });
      items.push({ type: "loader", id: "loader-2" });
    }
  } else if (didPoolsRequestFailed && pools.length > 0) {
    items.push({ type: "error", id: "error-next-page" });
  } else if (!hasNextPage && pools.length > 0) {
    items.push({ type: "no-more", id: "no-more" });
  }

  if (isDesktop && items.length % 2 !== 0) items.push({ type: "empty", id: "empty-" + items.length });
  const totalPages = isDesktop ? Math.ceil(items.length / 2) : items.length;

  return (
    <div className="relative flex items-center group mx-auto w-screen -ml-4 sm:w-[736px] sm:-ml-[40px]">
      <div className="absolute left-2 sm:left-[40px] z-40 hidden sm:flex items-center justify-center sm:-translate-x-[calc(100%+16px)] -translate-y-[40px]">
        <IconButton
          variant="tertiary"
          shape="circle"
          disabled={currentPage === 0}
          onClick={scrollLeft}
          onMouseEnter={() => backPageControllerIconRef.current?.startAnimation()}
          onMouseLeave={() => backPageControllerIconRef.current?.stopAnimation()}
          className="transition-opacity disabled:opacity-20"
          aria-label="Scroll left"
        >
          <ArrowLeftIcon ref={backPageControllerIconRef} size={22} className="text-foreground" />
        </IconButton>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        role="listbox"
        data-testid="carousel-scroll-container"
        className="flex gap-4 overflow-x-auto sm:overflow-hidden w-full px-4 sm:px-[40px] pt-[20px] pb-8 snap-x snap-mandatory sm:snap-none sm:mask-[linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((carouselItem, itemIndex) => {
          const isVisible = isDesktop ? Math.floor(itemIndex / 2) === currentPage : itemIndex === currentPage;
          const isLeft = itemIndex % 2 === 0;
          const jumpX = 0; // No horizontal offset for jumps
          const standardX = isLeft ? 100 : -100;
          const hiddenX = isPageIndicatorNavigationRef.current ? jumpX : standardX;
          const key = carouselItem.type === "pool" ? `${carouselItem.pool.address}-${carouselItem.pool.chainId}` : carouselItem.id;

          // When a new item is added to the DOM (pagination), we want it to animate its appearance even if the carousel as a whole is already mounted.
          const isInitialMount = !isMounted;

          return (
            <m.div
              key={key}
              layout
              initial={isInitialMount ? { opacity: 0, x: isDesktop ? standardX : 0 } : false}
              animate={{
                opacity: isVisible ? 1 : isDesktop ? 0 : 0.4,
                scale: isVisible ? 1 : 0.94,
                x: isDesktop ? (isVisible ? 0 : hiddenX) : 0,
                pointerEvents: isDesktop && !isVisible ? "none" : "auto",
              }}
              transition={{
                duration: isDesktop ? (isVisible ? 0.45 : 0.3) : isVisible ? 0.35 : 0.2,
                ease: isDesktop ? (isVisible ? [0.16, 1, 0.3, 1] : "easeOut") : isVisible ? [0.25, 0.1, 0.25, 1.0] : [0.42, 0, 1, 1],
                opacity: {
                  duration: isDesktop ? (isVisible ? 0.45 : 0.2) : isVisible ? 0.3 : 0.15,
                },
                scale: {
                  duration: 0.3,
                },
                x: {
                  delay: isDesktop ? (isVisible ? 0 : 0.3) : 0,
                  duration: isDesktop ? (isVisible ? 0.45 : 0.01) : 0,
                },
              }}
              style={{ willChange: "transform, opacity" }}
              className="shrink-0 w-[calc(100vw-32px)] sm:w-[320px] snap-center sm:px-0"
            >
              <PoolsCarouselItemContent carouselItem={carouselItem} yieldPeriod={yieldPeriod} translate={translate} fetchNextPage={fetchNextPage} />
            </m.div>
          );
        })}
      </div>

      <div className="absolute right-2 sm:right-[40px] z-40 hidden sm:flex items-center justify-center sm:translate-x-[calc(100%+16px)] -translate-y-[40px]">
        <IconButton
          variant="tertiary"
          shape="circle"
          disabled={currentPage >= totalPages - 1 && (!hasNextPage || didPoolsRequestFailed)}
          onClick={scrollRight}
          onMouseEnter={() => nextPageControllerIconRef.current?.startAnimation()}
          onMouseLeave={() => nextPageControllerIconRef.current?.stopAnimation()}
          className="transition-opacity disabled:opacity-20"
          aria-label="Scroll right"
        >
          <ArrowRightIcon ref={nextPageControllerIconRef} size={22} className="text-foreground" />
        </IconButton>
      </div>

      {/* Page Counter Dots */}
      <div className="absolute top-full mt-2 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <PageCounter totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageIndicatorNavigation} />
        </div>
      </div>
    </div>
  );
}

function PoolsCarouselItemContent({
  carouselItem,
  yieldPeriod,
  translate,
  fetchNextPage,
}: {
  carouselItem: CarouselItem;
  yieldPeriod: YieldPeriod;
  translate: (key: AppTranslationsKeys) => string;
  fetchNextPage: () => void;
}) {
  if (carouselItem.type === "pool") return <PoolCard pool={carouselItem.pool} yieldPeriod={yieldPeriod} className="h-full" />;

  if (carouselItem.type === "loader") {
    return (
      <div
        className="w-full h-full bg-card backdrop-blur-md border border-card-border rounded-[30px] flex items-center justify-center"
        style={{ minHeight: PoolCardConstants.MIN_HEIGHT }}
      >
        <LoadingText text={translate(AppTranslationsKeys.POOLS_CAROUSEL_LOADING_MORE)} />
      </div>
    );
  }

  if (carouselItem.type === "no-more") {
    return (
      <div
        className="w-full h-full bg-card backdrop-blur-md border border-card-border rounded-[30px] flex flex-col items-center justify-center gap-4 text-center p-6"
        style={{ minHeight: PoolCardConstants.MIN_HEIGHT }}
      >
        <div className="w-26 h-22 flex items-center justify-center">
          <img src={PoolRingSVG} className="w-full h-full object-contain" alt="No more pools" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{translate(AppTranslationsKeys.POOLS_CAROUSEL_END_TITLE)}</h3>
          <p className="text-sm text-mutated-text">{translate(AppTranslationsKeys.POOLS_CAROUSEL_END_DESCRIPTION)}</p>
        </div>
      </div>
    );
  }

  if (carouselItem.type === "error") return <PoolsCarouselErrorCard retry={() => fetchNextPage()} translate={translate} />;

  // Final fallback (type === 'empty')
  return <div className="w-full h-full hidden sm:block pointer-events-none" style={{ minHeight: PoolCardConstants.MIN_HEIGHT }} />;
}

function PoolsCarouselErrorCard({ retry, translate }: { retry: () => void; translate: (key: AppTranslationsKeys) => string }) {
  return (
    <div
      className="w-full h-full bg-card backdrop-blur-md border border-card-border rounded-[30px] flex flex-col items-center justify-center gap-4 text-center p-6"
      style={{ minHeight: PoolCardConstants.MIN_HEIGHT }}
    >
      <div className="w-26 h-22 flex items-center justify-center">
        <img src={EscalerinDeadImage} className="w-full h-full object-contain" alt="Error loading pools" />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">{translate(AppTranslationsKeys.POOLS_CAROUSEL_ERROR_TITLE)}</h3>
        <p className="text-sm text-mutated-text mb-4">{translate(AppTranslationsKeys.POOLS_CAROUSEL_ERROR_DESCRIPTION)}</p>
        <TextButton icon={<RefreshIcon />} onClick={retry}>
          {translate(AppTranslationsKeys.POOLS_CAROUSEL_TRY_AGAIN)}
        </TextButton>
      </div>
    </div>
  );
}
