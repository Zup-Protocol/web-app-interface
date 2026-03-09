import { SearchSettingsConfig } from "@/core/search-settings-config";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { CustomEvent } from "@/lib/custom-event";
import { LocalStorage } from "@/lib/utils/local-storage-service";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewPositionForm } from "./new-position-form";

// ─── Module Mocks ────────────────────────────────────────────────────────────

const mockNavigateToPoolsSearch = vi.fn();
vi.mock("@/lib/zup-navigator", () => ({
  useZupNavigator: () => ({ navigateToPoolsSearch: mockNavigateToPoolsSearch }),
}));

vi.mock("@/hooks/use-network", () => ({
  useAppNetwork: () => ({ network: "ethereum" }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({ translate: (key: string) => key }),
}));

vi.mock("@/lib/utils/local-storage-service", () => ({
  LocalStorage: { getSearchSettings: vi.fn() },
}));

vi.mock("@/providers/app-providers", () => ({
  AppProviders: ({ children }: any) => <>{children}</>,
}));

// framer-motion — export both `m` and `motion` via Proxy so child components work
vi.mock("framer-motion", () => {
  const el = (tag: string) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef((props: any, ref: any) => React.createElement(tag, { ...props, ref }));
  const motion = new Proxy({} as any, { get: (_t, p: string) => el(p) });
  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Popover — toggle open state via trigger click, render content when open
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children, open, onOpenChange }: any) => {
    const kids = React.Children.toArray(children) as React.ReactElement[];
    const trigger = kids.find((c) => c.props?.asChild);
    const content = kids.find((c) => !c.props?.asChild);
    return (
      <div>
        <div onClick={() => onOpenChange?.(!open)}>{trigger}</div>
        {open && <div data-testid="popover-content">{content}</div>}
      </div>
    );
  },
  PopoverTrigger: ({ children }: any) => <>{children}</>,
  PopoverContent: ({ children }: any) => <>{children}</>,
}));

// AssetSelectorView — functional mock that fires all callbacks
vi.mock("@/components/asset-selector/view/asset-selector-view", () => ({
  AssetSelectorView: ({ onSelect, onDeselect, onBack, side, currentSelectedAsset }: any) => (
    <div data-testid="asset-selector-view">
      <span data-testid="selector-side">{side}</span>
      {currentSelectedAsset && <span data-testid="current-selected">{currentSelectedAsset.symbol}</span>}
      <button data-testid="btn-select" onClick={() => onSelect({ id: "eth", symbol: "ETH", type: "single-chain-token" })}>
        Select
      </button>
      <button data-testid="btn-deselect" onClick={() => onDeselect()}>
        Deselect
      </button>
      <button data-testid="btn-back" onClick={() => onBack()}>
        Back
      </button>
    </div>
  ),
}));

// AssetSelectorButton — shows label or selected asset symbol
vi.mock("@/components/asset-selector/asset-selector-button", () => ({
  AssetSelectorButton: ({ label, onClick, selectedAsset, "data-testid": testId }: any) => (
    <button onClick={onClick} data-testid={testId ?? "asset-btn"}>
      {selectedAsset ? selectedAsset.symbol : label}
    </button>
  ),
}));

vi.mock("@/components/new-position/search-settings-content", () => ({
  SearchSettingsContent: ({ onDone, onExchangesClick }: any) => (
    <div data-testid="search-settings-content">
      <button data-testid="btn-done" onClick={onDone}>
        Done
      </button>
      <button data-testid="btn-exchanges" onClick={onExchangesClick}>
        Exchanges
      </button>
    </div>
  ),
}));

vi.mock("@/components/modals/exchanges-filter-modal", () => ({
  ExchangesFilterModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div role="dialog">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

vi.mock("@/components/ui/icons/cog", () => ({
  CogIcon: React.forwardRef(({ className }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ startAnimation: vi.fn(), stopAnimation: vi.fn() }));
    return <svg data-testid="cog-icon" className={className} />;
  }),
}));

vi.mock("@/components/ui/icons/sparkles", () => ({
  SparklesIcon: React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ startAnimation: vi.fn(), stopAnimation: vi.fn() }));
    return <svg data-testid="sparkles-icon" {...props} />;
  }),
}));

vi.mock("@/components/ui/buttons/primary-button", () => ({
  PrimaryButton: ({ children, onClick, onMouseEnter, onMouseLeave, ...rest }: any) => (
    <button data-testid="primary-button" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("../ui/badge", () => ({ Badge: () => <div data-testid="badge" /> }));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("NewPositionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(LocalStorage.getSearchSettings).mockReturnValue(SearchSettingsConfig.default);
    window.scrollTo = vi.fn();
  });

  it("renders title and settings button", () => {
    render(<NewPositionForm />);
    expect(screen.getByText(AppTranslationsKeys.NEW_POSITION_TITLE)).toBeInTheDocument();
    expect(screen.getByLabelText("Search Settings")).toBeInTheDocument();
    expect(screen.getByTestId("cog-icon")).toBeInTheDocument();
  });

  it("opens asset selector for side A and selects an asset", async () => {
    render(<NewPositionForm />);

    // Click the Asset A button (first unselected)
    fireEvent.click(screen.getByTestId("asset-selector-A"));
    expect(screen.getByTestId("asset-selector-view")).toBeInTheDocument();
    expect(screen.getByTestId("selector-side")).toHaveTextContent("A");

    // Select an asset
    fireEvent.click(screen.getByTestId("btn-select"));

    // Selector closes, Asset A shows symbol
    await waitFor(() => expect(screen.queryByTestId("asset-selector-view")).not.toBeInTheDocument());
    expect(screen.getByTestId("asset-selector-A")).toHaveTextContent("ETH");
  });

  it("opens asset selector for side B and selects an asset", async () => {
    render(<NewPositionForm />);

    fireEvent.click(screen.getByTestId("asset-selector-B"));
    expect(screen.getByTestId("selector-side")).toHaveTextContent("B");

    fireEvent.click(screen.getByTestId("btn-select"));
    await waitFor(() => expect(screen.queryByTestId("asset-selector-view")).not.toBeInTheDocument());
    expect(screen.getByTestId("asset-selector-B")).toHaveTextContent("ETH");
  });

  it("deselects an asset via the selector view", async () => {
    render(<NewPositionForm />);

    // Select A first
    fireEvent.click(screen.getByTestId("asset-selector-A"));
    fireEvent.click(screen.getByTestId("btn-select"));
    await waitFor(() => expect(screen.getByTestId("asset-selector-A")).toHaveTextContent("ETH"));

    // Re-open and deselect
    fireEvent.click(screen.getByTestId("asset-selector-A"));
    expect(screen.getByTestId("current-selected")).toHaveTextContent("ETH");
    fireEvent.click(screen.getByTestId("btn-deselect"));

    await waitFor(() => expect(screen.getByTestId("asset-selector-A")).toHaveTextContent(AppTranslationsKeys.NEW_POSITION_SELECT_ASSET));
  });

  it("closes the selector via the Back button", async () => {
    render(<NewPositionForm />);

    fireEvent.click(screen.getByTestId("asset-selector-A"));
    expect(screen.getByTestId("asset-selector-view")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-back"));
    await waitFor(() => expect(screen.queryByTestId("asset-selector-view")).not.toBeInTheDocument());
  });

  it("enables search button and navigates when both assets are selected", async () => {
    render(<NewPositionForm />);

    fireEvent.click(screen.getByTestId("asset-selector-A"));
    fireEvent.click(screen.getByTestId("btn-select"));
    await waitFor(() => expect(screen.queryByTestId("asset-selector-view")).not.toBeInTheDocument());

    fireEvent.click(screen.getByTestId("asset-selector-B"));
    fireEvent.click(screen.getByTestId("btn-select"));
    await waitFor(() => expect(screen.queryByTestId("asset-selector-view")).not.toBeInTheDocument());

    const searchBtn = screen.getByTestId("primary-button");
    fireEvent.mouseEnter(searchBtn);
    fireEvent.mouseLeave(searchBtn);
    fireEvent.click(searchBtn);

    expect(mockNavigateToPoolsSearch).toHaveBeenCalledWith(expect.objectContaining({ assetA: expect.anything(), assetB: expect.anything() }));
  });

  it("highlights settings icon when search settings differ from defaults", async () => {
    render(<NewPositionForm />);

    vi.mocked(LocalStorage.getSearchSettings).mockReturnValue({
      ...SearchSettingsConfig.default,
      minLiquidity: "9999",
    });

    act(() => {
      window.dispatchEvent(new Event(CustomEvent.SEARCH_SETTINGS_CHANGED));
    });

    await waitFor(() => expect(screen.getByTestId("cog-icon")).toHaveClass("text-orange-400"));
  });

  it("opens settings popover, opens exchanges modal, then closes both", async () => {
    render(<NewPositionForm />);

    // Open popover via settings button
    fireEvent.click(screen.getByLabelText("Search Settings"));
    expect(screen.getByTestId("search-settings-content")).toBeInTheDocument();

    // Open exchanges modal
    fireEvent.click(screen.getByTestId("btn-exchanges"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close exchanges modal
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Close popover via Done
    fireEvent.click(screen.getByTestId("btn-done"));
    expect(screen.queryByTestId("search-settings-content")).not.toBeInTheDocument();
  });

  it("handles settings icon hover animations", () => {
    render(<NewPositionForm />);

    const settingsBtn = screen.getByLabelText("Search Settings");
    fireEvent.pointerEnter(settingsBtn);
    fireEvent.pointerLeave(settingsBtn);
    // No error = pass; icon ref startAnimation/stopAnimation called
  });
});
