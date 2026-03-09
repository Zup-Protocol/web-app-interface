import { YieldPeriod } from "@/core/enums/yield-period";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PoolsCarousel } from "./pools-carousel";
// Mock SVG assets
vi.mock("@/assets/escalerin/escalerin-dead.svg", () => ({ default: "dead.svg" }));
vi.mock("@/assets/escalerin/escalerin-sad-mistake.svg", () => ({ default: "sad.svg" }));
vi.mock("@/assets/escalerin/escalerin-searching-box.svg", () => ({ default: "searching.svg" }));
vi.mock("@/assets/svg/pool-ring.svg", () => ({ default: "ring.svg" }));

// Mock hooks
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

const mockMediaQuery = vi.fn();
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: (query: string) => mockMediaQuery(query),
}));

// Mock PoolCard
vi.mock("./pool-card", () => ({
  PoolCard: ({ pool }: any) => <div data-testid="pool-card">{pool.id}</div>,
  PoolCardConstants: { WIDTH: 320, MIN_HEIGHT: 318, HEIGHT: 400 },
}));

// Mock components
vi.mock("@/components/ui/page-counter", () => ({
  PageCounter: ({ onPageChange, totalPages, currentPage }: any) => (
    <div data-testid="page-counter" data-total={totalPages} data-current={currentPage}>
      <button onClick={() => onPageChange(1)}>Go to page 1</button>
    </div>
  ),
}));

vi.mock("framer-motion", async () => {
  const mockMotionElement = (tag: string) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef((props: any, ref: any) => React.createElement(tag, { ...props, ref }));

  const motion = new Proxy({} as any, {
    get: (_target, prop: string) => mockMotionElement(prop),
  });

  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
  };
});

const mockPools: any[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  address: `0x${i + 1}`,
  chainId: 1,
  tokens: [{ symbol: "A" }, { symbol: "B" }],
  stats: { stats24h: { yield: 1 }, stats7d: { yield: 2 }, stats30d: { yield: 3 }, stats90d: { yield: 4 } },
  balance: { totalValueLockedUsd: 1000 },
}));

describe("PoolsCarousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMediaQuery.mockReturnValue(true); // Desktop
    if (typeof window !== "undefined") {
      Element.prototype.scrollTo = vi.fn();
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("handles desktop pagination and animations", async () => {
    vi.useFakeTimers();
    render(<PoolsCarousel pools={mockPools} isLoading={false} hasNextPage={true} fetchNextPage={() => {}} isFetchingNextPage={false} yieldPeriod={YieldPeriod.Day} />);

    act(() => {
      vi.runAllTimers();
    });

    const rightBtn = screen.getByLabelText("Scroll right");
    fireEvent.pointerEnter(rightBtn);
    fireEvent.click(rightBtn);
    fireEvent.pointerLeave(rightBtn);
    expect(Element.prototype.scrollTo).toHaveBeenCalled();

    const leftBtn = screen.getByLabelText("Scroll left");
    fireEvent.pointerEnter(leftBtn);
    fireEvent.click(leftBtn);
    fireEvent.pointerLeave(leftBtn);
    expect(Element.prototype.scrollTo).toHaveBeenCalledTimes(2);
  });

  it("handles mobile layout stride calculation and handleScroll", () => {
    mockMediaQuery.mockReturnValue(false); // Mobile
    render(<PoolsCarousel pools={mockPools} isLoading={false} hasNextPage={false} fetchNextPage={() => {}} isFetchingNextPage={false} yieldPeriod={YieldPeriod.Day} />);

    const container = screen.getByTestId("carousel-scroll-container");
    const children = [{ offsetLeft: 0 }, { offsetLeft: 350 }, { offsetLeft: 700 }];
    Object.defineProperty(container, "children", { value: children });
    Object.defineProperty(container, "scrollLeft", { value: 350, writable: true });
    Object.defineProperty(container, "clientWidth", { value: 350, writable: true });

    // Trigger scroll Right
    fireEvent.click(screen.getByLabelText("Scroll right"));
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: 350 }));

    // Trigger manual scroll
    fireEvent.scroll(container);
    expect(screen.getByTestId("page-counter")).toHaveAttribute("data-current", "1");
  });

  it("triggers fetchNextPage on scroll when near end", async () => {
    const fetchNextPage = vi.fn();
    render(<PoolsCarousel pools={mockPools} isLoading={false} hasNextPage={true} fetchNextPage={fetchNextPage} isFetchingNextPage={false} yieldPeriod={YieldPeriod.Day} />);

    const container = screen.getByTestId("carousel-scroll-container");
    Object.defineProperty(container, "scrollLeft", { value: 2500, writable: true });
    Object.defineProperty(container, "clientWidth", { value: 1000, writable: true });
    Object.defineProperty(container, "scrollWidth", { value: 3400, writable: true });

    fireEvent.scroll(container);
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("renders loader, error, and end states", () => {
    const { rerender } = render(
      <PoolsCarousel pools={mockPools.slice(0, 2)} isLoading={false} hasNextPage={true} fetchNextPage={() => {}} isFetchingNextPage={true} yieldPeriod={YieldPeriod.Day} />,
    );
    expect(screen.getAllByText(new RegExp(AppTranslationsKeys.POOLS_CAROUSEL_LOADING_MORE)).length).toBeGreaterThan(0);

    const refetch = vi.fn();
    rerender(
      <PoolsCarousel
        pools={mockPools.slice(0, 2)}
        isLoading={false}
        isError={true}
        refetch={refetch}
        hasNextPage={false}
        fetchNextPage={() => {}}
        isFetchingNextPage={false}
        yieldPeriod={YieldPeriod.Day}
      />,
    );
    expect(screen.getByText(new RegExp(AppTranslationsKeys.POOLS_CAROUSEL_ERROR_TITLE))).toBeInTheDocument();

    rerender(
      <PoolsCarousel pools={mockPools.slice(0, 2)} isLoading={false} hasNextPage={false} fetchNextPage={() => {}} isFetchingNextPage={false} yieldPeriod={YieldPeriod.Day} />,
    );
    expect(screen.getByText(new RegExp(AppTranslationsKeys.POOLS_CAROUSEL_END_TITLE))).toBeInTheDocument();
  });

  it("handles page indicator navigation", () => {
    render(<PoolsCarousel pools={mockPools} isLoading={false} hasNextPage={false} fetchNextPage={() => {}} isFetchingNextPage={false} yieldPeriod={YieldPeriod.Day} />);
    fireEvent.click(screen.getByText("Go to page 1"));
    expect(Element.prototype.scrollTo).toHaveBeenCalled();
  });

  it("renders empty state", () => {
    render(<PoolsCarousel pools={[]} isLoading={false} hasNextPage={false} fetchNextPage={() => {}} isFetchingNextPage={false} yieldPeriod={YieldPeriod.Day} />);
    expect(screen.getByText(new RegExp(AppTranslationsKeys.POOLS_CAROUSEL_EMPTY_TITLE))).toBeInTheDocument();
  });
});
