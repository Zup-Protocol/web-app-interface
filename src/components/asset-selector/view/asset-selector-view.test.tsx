import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AssetSelectorView } from "./asset-selector-view";

// Mock dependencies
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => false, // Default to mobile for full view
}));

vi.mock("@/hooks/use-scroll-lock", () => ({
  useScrollLock: vi.fn(),
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

// Mock icons to avoid rendering complexities in test
vi.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left" />,
  Search: () => <div data-testid="search-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

describe("AssetSelectorView", () => {
  const defaultProps = {
    onBack: vi.fn(),
    onSelect: vi.fn(),
    onDeselect: vi.fn(),
  };

  it("replaces {query} placeholder in empty state description", async () => {
    render(<AssetSelectorView side={"A"} {...defaultProps} />);

    // Find search input
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
