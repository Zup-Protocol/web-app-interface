import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExchangesFilterModal } from "./exchanges-filter-modal";

// Mock dependencies
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    m: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

vi.mock("@/components/ui/modal", () => ({
  Modal: ({ isOpen, children }: any) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock("../ui/animations/scale-click-animation", () => ({
  ScaleClickAnimation: ({ children, onClick }: any) => (
    <div onClick={onClick}>{children}</div>
  ),
}));

vi.mock("../ui/buttons/close-button", () => ({
  CloseButton: ({ onClick }: any) => <button onClick={onClick}>Close</button>,
}));

vi.mock("../ui/search-input", () => ({
  SearchInput: ({ value, onChange, onClear }: any) => (
    <div data-testid="search-input-container">
      <input data-testid="search-input" value={value} onChange={onChange} />
      <button onClick={onClear}>Clear</button>
    </div>
  ),
}));

vi.mock("../ui/segmented-control", () => ({
  SegmentedControl: ({ value, onChange, options }: any) => (
    <div>
      {options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          data-testid={`segment-${opt.value}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../ui/state-display", () => ({
  StateDisplay: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("@/lib/supported-dexs", async () => {
  return {
    SupportedDexs: {
      UNISWAP_V3: "uniswap-v3",
      PANCAKE_SWAP_V3: "pancakeswap-v3",
    },
    SupportedDexsUtils: {
      count: 2,
      metadata: {
        "uniswap-v3": {
          name: "Uniswap V3",
          logo: { src: "test.svg" },
          logoBackgroundColor: "#000",
          textColorOnBackground: "#fff",
        },
        "pancakeswap-v3": {
          name: "PancakeSwap V3",
          logo: { src: "test.svg" },
          logoBackgroundColor: "#000",
          textColorOnBackground: "#fff",
        },
      },
    },
  };
});

describe("ExchangesFilterModal", () => {
  const onCloseMock = vi.fn();
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReturnValue(undefined);
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    // Validate scrollTo mock for JSDOM
    window.HTMLElement.prototype.scrollTo = vi.fn();
  });

  it("renders when open", () => {
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<ExchangesFilterModal isOpen={false} onClose={onCloseMock} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("loads blocked exchanges from local storage", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ blockedExchanges: ["uniswap-v3"] }),
    );
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByText("(1/2)")).toBeInTheDocument();
  });

  it("toggles single exchange block status", () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const items = screen.getAllByRole("img");
    fireEvent.click(items[0].parentElement!);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      LocalStorageKey.SEARCH_SETTINGS,
      expect.stringContaining('"blockedExchanges":'),
    );
  });

  it("handles toggle all (Select All / Clear All)", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ blockedExchanges: [] }),
    );
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const toggleAllBtn = screen.getByRole("button", {
      name: /exchangesFilterModal\.(clearAll|selectAll)/i,
    });
    fireEvent.click(toggleAllBtn);
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const lastCall = JSON.parse(
      vi.mocked(localStorageMock.setItem).mock.calls.at(-1)![1],
    );

    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ blockedExchanges: lastCall.blockedExchanges }),
    );
    // Cleanup and re-render
    const { cleanup } = require("@testing-library/react");
    cleanup();
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const buttons = screen.getAllByRole("button", {
      name: /exchangesFilterModal\.(clearAll|selectAll)/i,
    });
    fireEvent.click(buttons[0]);
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const lastCall2 = JSON.parse(
      vi.mocked(localStorageMock.setItem).mock.calls.at(-1)![1],
    );
    expect(lastCall2.blockedExchanges.length).toBe(0);
  });

  it("filters updates based on search", () => {
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    expect(
      screen.getByText(AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_TITLE),
    ).toBeInTheDocument();
  });

  it("changes view filter", async () => {
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const enabledFilter = screen.getByTestId("segment-enabled");
    fireEvent.click(enabledFilter);
    await waitFor(() => {
      expect(screen.queryAllByRole("img").length).toBeGreaterThan(0);
    });
  });

  it("updates local storage and dispatches event on change", () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const toggleAllBtn = screen.getByRole("button", {
      name: /exchangesFilterModal\.(clearAll|selectAll)/i,
    });
    fireEvent.click(toggleAllBtn);
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it("handles search clear", () => {
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Uni" } });
    expect(searchInput).toHaveValue("Uni");
    fireEvent.click(screen.getByText("Clear"));
    expect(searchInput).toHaveValue("");
  });

  it("handles 'enabled' and 'disabled' view filters", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ blockedExchanges: ["uniswap-v3"] }),
    );
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);

    const disabledBtn = screen.getByText(
      AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_DISABLED,
    );
    fireEvent.click(disabledBtn);
    expect(screen.getByText("Uniswap V3")).toBeInTheDocument();

    const enabledBtn = screen.getByText(
      AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ENABLED,
    );
    fireEvent.click(enabledBtn);
    expect(screen.queryByText("Uniswap V3")).not.toBeInTheDocument();
  });

  it("handles localStorage setItem error gracefully", () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error("Quota exceeded");
    });
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);
    const items = screen.getAllByRole("img");
    fireEvent.click(items[0].parentElement!);
    // Should not crash
  });

  it("unblocks an exchange when toggling a blocked one", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ blockedExchanges: ["uniswap-v3"] }),
    );
    render(<ExchangesFilterModal isOpen={true} onClose={onCloseMock} />);

    // Find Uniswap V3 and click to unblock it
    const items = screen.getAllByRole("img");
    const uniswapItem = items.find((img) =>
      img.getAttribute("alt")?.includes("Uniswap V3"),
    );

    if (uniswapItem?.parentElement) {
      fireEvent.click(uniswapItem.parentElement);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    }
  });
});
