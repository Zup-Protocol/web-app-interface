import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("@/hooks/tokens/use-hydric-tokens", () => ({
  useHydricTokens: vi.fn().mockReturnValue({
    data: { tokens: [] },
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
  }),
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
  },
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left" />,
  Search: () => <div data-testid="search-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

vi.mock("framer-motion", () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Now import the component
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
});
