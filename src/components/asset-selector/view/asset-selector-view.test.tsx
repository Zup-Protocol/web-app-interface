import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock dependencies at the top level
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => false,
}));

vi.mock("@/hooks/use-scroll-lock", () => ({
  useScrollLock: vi.fn(),
}));

vi.mock("@/providers/hydric-provider", () => ({
  useHydric: vi.fn(),
}));

vi.mock("@/hooks/tokens/use-hydric-baskets", () => ({
  useHydricBaskets: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
  }),
}));

const mockUseHydricTokens = vi.fn().mockReturnValue({
  data: { tokens: [] },
  isLoading: false,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  error: null,
  refetch: vi.fn(),
});

vi.mock("@/hooks/tokens/use-hydric-tokens", () => ({
  useHydricTokens: (params: any) => mockUseHydricTokens(params),
}));

vi.mock("@/hooks/use-network", () => ({
  useAppNetwork: () => ({
    network: 0,
  }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => {
      if (key === "assetSelector.empty.description") {
        return 'No results found for "{query}".';
      }
      return key;
    },
  }),
}));

vi.mock("@/i18n/app-translations-keys", () => ({
  AppTranslationsKeys: {
    ASSET_SELECTOR_EMPTY_TITLE: "assetSelector.empty.title",
    ASSET_SELECTOR_EMPTY_DESCRIPTION: "assetSelector.empty.description",
    ASSET_SELECTOR_SEARCH_PLACEHOLDER: "assetSelector.searchPlaceholder",
    ASSET_SELECTOR_SEARCH_RESULTS_TITLE: "assetSelector.searchResults.title",
    ASSET_SELECTOR_ERROR_TITLE: "assetSelector.error.title",
    ASSET_SELECTOR_ERROR_DESCRIPTION: "assetSelector.error.description",
    ASSET_SELECTOR_ERROR_RETRY: "assetSelector.error.retry",
    ASSET_SELECTOR_BASKETS_TITLE: "assetSelector.baskets.title",
    ASSET_SELECTOR_TOKENS_TITLE: "assetSelector.tokens.title",
    ASSET_SELECTOR_BASKET_SUBTITLE_TOKENS:
      "assetSelector.basket.subtitle.tokens",
    ASSET_SELECTOR_BASKET_SUBTITLE_NETWORKS:
      "assetSelector.basket.subtitle.networks",
    ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORK:
      "assetSelector.token.subtitle.network",
    ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORKS:
      "assetSelector.token.subtitle.networks",
    ASSET_SELECTOR_FILTER_ALL: "assetSelector.filter.all",
    ASSET_SELECTOR_FILTER_TOKENS: "assetSelector.filter.tokens",
    ASSET_SELECTOR_FILTER_BASKETS: "assetSelector.filter.baskets",
  },
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left" />,
  Search: () => <div data-testid="search-icon" />,
  X: () => <div data-testid="x-icon" />,
  Blend: () => <div data-testid="blend-icon" />,
  Coins: () => <div data-testid="coins-icon" />,
  ShoppingBasket: () => <div data-testid="shopping-basket-icon" />,
}));

vi.mock("framer-motion", () => {
  const motionComponent = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  );
  const m = {
    div: motionComponent,
    button: motionComponent,
    span: motionComponent,
    svg: motionComponent,
    circle: motionComponent,
    path: motionComponent,
    img: ({ src, alt, ...props }: any) => (
      <img src={src} alt={alt} {...props} />
    ),
  };
  return {
    motion: m,
    m: m,
    AnimatePresence: ({ children }: any) => children,
    LayoutGroup: ({ children }: any) => children,
    useAnimation: () => ({
      start: vi.fn(() => new Promise((resolve) => setTimeout(resolve, 0))),
      stop: vi.fn(),
      subscribe: vi.fn(() => () => {}),
    }),
    useReducedMotion: () => false,
    useScroll: () => ({
      scrollYProgress: { get: () => 0, onChange: () => {} },
    }),
    useSpring: (v: any) => v,
    useTransform: (v: any) => v,
  };
});

// Now import the component
import { useHydricBaskets } from "@/hooks/tokens/use-hydric-baskets";
import { AssetSelectorView } from "./asset-selector-view";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("AssetSelectorView", () => {
  const defaultProps = {
    onBack: vi.fn(),
    onSelect: vi.fn(),
    onDeselect: vi.fn(),
  };

  it("replaces {query} placeholder in empty state description", async () => {
    // We mock the hooks return values for this specific test
    // To avoid the useHydric error, we can mock the hooks at the module level
    // if the provider wrap is not enough (because of useHydric being called in queryFn)
    render(
      <QueryClientProvider client={queryClient}>
        <AssetSelectorView side={"A"} {...defaultProps} />
      </QueryClientProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      "assetSelector.searchPlaceholder",
    );

    // Type a query that yields no results
    const query = "NonExistentToken123";
    fireEvent.change(searchInput, { target: { value: query } });

    // Check if the empty state description contains the replaced query
    expect(
      screen.getByText(`No results found for "${query}".`),
    ).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    mockUseHydricTokens.mockReturnValueOnce({
      data: { tokens: [] },
      isLoading: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AssetSelectorView side={"A"} {...defaultProps} />
      </QueryClientProvider>,
    );

    // Should show skeletons (there is one in header and some in list)
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders error state and handles retry", () => {
    const error = new Error("Failed to fetch");
    const refetch = vi.fn();
    mockUseHydricTokens.mockReturnValueOnce({
      data: { tokens: [] },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      error: error,
      refetch: refetch,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AssetSelectorView side={"A"} {...defaultProps} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("assetSelector.error.title")).toBeInTheDocument();
    expect(
      screen.getByText("assetSelector.error.description"),
    ).toBeInTheDocument();

    const retryButton = screen.getByText("assetSelector.error.retry");
    fireEvent.click(retryButton);

    expect(refetch).toHaveBeenCalled();
  });
});

describe("AssetSelectorView Filtering", () => {
  const defaultProps = {
    onBack: vi.fn(),
    onSelect: vi.fn(),
    onDeselect: vi.fn(),
  };

  const mockTokens = [
    { type: "token", id: "1", symbol: "T1", address: "0x1", chainId: 1 },
  ];
  const mockBaskets = [
    {
      type: "basket" as const,
      id: "b1" as any,
      symbol: "B1",
      tokens: [],
      chainIds: [],
      name: "B1",
      description: "B1 desc",
      logoUrl: "",
      addresses: [],
    },
  ];

  it("filters assets by type when tabs are clicked", async () => {
    // Mock tokens and baskets
    mockUseHydricTokens.mockReturnValue({
      data: { tokens: mockTokens },
      isLoading: false,
    });
    vi.mocked(useHydricBaskets).mockReturnValue({
      data: mockBaskets,
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AssetSelectorView side={"A"} {...defaultProps} />
      </QueryClientProvider>,
    );

    // Default "All" state: both should be present
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("B1")).toBeInTheDocument();

    // Click "Tokens" tab
    const tokensTab = screen.getByText("assetSelector.filter.tokens");
    fireEvent.click(tokensTab);

    // Only tokens should be visible
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.queryByText("B1")).not.toBeInTheDocument();

    // Click "Baskets" tab
    const basketsTab = screen.getByText("assetSelector.filter.baskets");
    fireEvent.click(basketsTab);

    // Only baskets should be visible
    expect(screen.queryByText("T1")).not.toBeInTheDocument();
    expect(screen.getByText("B1")).toBeInTheDocument();

    // Click "All" tab
    const allTab = screen.getByText("assetSelector.filter.all");
    fireEvent.click(allTab);

    // Both should be visible again
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("B1")).toBeInTheDocument();
  });

  it("hides filters when searching", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssetSelectorView side={"A"} {...defaultProps} />
      </QueryClientProvider>,
    );

    // Initially tabs are visible
    expect(screen.getByText("assetSelector.filter.all")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      "assetSelector.searchPlaceholder",
    );
    fireEvent.change(searchInput, { target: { value: "search query" } });

    // Tabs should be hidden after debounce
    await waitFor(
      () => {
        expect(
          screen.queryByText("assetSelector.filter.all"),
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
