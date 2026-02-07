import { DEFAULT_SEARCH_SETTINGS } from "@/core/DTOs/search-settings-config.dto";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { CustomEvent } from "@/lib/custom-event";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchSettingsContent } from "./search-settings-content";

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
      button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
      ),
    },
  };
});

// Mock dependencies
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

vi.mock("@/components/ui/usd-input", () => ({
  UsdInput: ({ value, onValueChange, onKeyDown }: any) => (
    <input
      data-testid="usd-input"
      value={value}
      onChange={(e) => {
        onValueChange(e.target.value);
      }}
      onKeyDown={onKeyDown}
    />
  ),
}));

vi.mock("@/components/ui/info-tooltip", () => ({
  InfoTooltip: () => <div data-testid="info-tooltip" />,
}));

vi.mock("@/components/ui/buttons/primary-button", () => ({
  PrimaryButton: ({ children, onClick, state, icon }: any) => (
    <button onClick={onClick} data-state={state}>
      {icon}
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/icons/sliders", () => ({
  SlidersHorizontalIcon: () => <svg data-testid="sliders-icon" />,
}));

vi.mock("@/components/ui/icons/trash", () => ({
  DeleteIcon: () => <svg data-testid="delete-icon" />,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: () => <div data-testid="badge" />,
}));

vi.mock("@/providers/animation-provider", () => ({
  AnimationProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("SearchSettingsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockImplementation(() => null); // Default return
  });

  it("renders correctly with default values", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(DEFAULT_SEARCH_SETTINGS),
    );
    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText(AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TITLE),
    ).toBeInTheDocument();
    expect(screen.getByTestId("usd-input")).toHaveValue(
      DEFAULT_SEARCH_SETTINGS.minLiquidity,
    );
  });

  it("calls onDone when Enter is pressed in UsdInput", () => {
    const onDoneMock = vi.fn();
    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
        onDone={onDoneMock}
      />,
    );

    const input = screen.getByTestId("usd-input");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onDoneMock).toHaveBeenCalled();
  });

  it("calls onExchangesClick when exchanges button is clicked", () => {
    const onExchangesClickMock = vi.fn();
    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={onExchangesClickMock}
      />,
    );

    const button = screen.getByRole("button", {
      name: new RegExp(AppTranslationsKeys.EXCHANGES_FILTER_MODAL_TITLE),
    });
    fireEvent.click(button);

    expect(onExchangesClickMock).toHaveBeenCalled();
  });

  it("updates minLiquidity in localStorage and dispatches event on input change", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(DEFAULT_SEARCH_SETTINGS),
    );

    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    const input = screen.getByTestId("usd-input");

    // Changing value
    fireEvent.change(input, { target: { value: "5000" } });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LocalStorageKey.SEARCH_SETTINGS,
        expect.stringContaining('"minLiquidity":"5000"'),
      );
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe(
      CustomEvent.SEARCH_SETTINGS_CHANGED,
    );
  });

  it("resets settings to default when clear button is clicked", () => {
    // Mock storage with modified settings
    const modified = { ...DEFAULT_SEARCH_SETTINGS, minLiquidity: "999" };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(modified));
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    // Verify modified value shown
    expect(screen.getByTestId("usd-input")).toHaveValue("999");

    // Find clear button (trash icon inside PrimaryButton)
    // Since mock returns DeleteIcon SVG, check logic:
    // The button only appears if hasChanges() is true.
    // We mocked localStorage get, but component initializes state from it.

    const buttons = screen.getAllByRole("button");
    // One of them should be the "Reset" button (destructivePrimary)
    // We can find it by icon name or just click the last one if we assume order.
    // Or find by mocked DeleteIcon.

    const deleteIcon = screen.getByTestId("delete-icon");
    const clearBtn = deleteIcon.closest("button");

    fireEvent.click(clearBtn!);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      LocalStorageKey.SEARCH_SETTINGS,
      JSON.stringify(DEFAULT_SEARCH_SETTINGS),
    );

    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));

    // Test hover transition while we are here
    fireEvent.mouseEnter(clearBtn!);
    fireEvent.mouseLeave(clearBtn!);
  });

  it("shows warning for low liquidity", () => {
    // Logic: Number(minLiquidity) < 1000
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ ...DEFAULT_SEARCH_SETTINGS, minLiquidity: "500" }),
    );

    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        AppTranslationsKeys.SEARCH_SETTINGS_LOW_LIQUIDITY_WARNING,
      ),
    ).toBeInTheDocument();
  });

  it("shows badge when some exchanges are blocked", () => {
    render(
      <SearchSettingsContent
        blockedExchangesCount={2}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("handles localStorage errors gracefully during initialization", () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("Local storage is disabled");
    });

    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    expect(screen.getByTestId("usd-input")).toHaveValue(
      DEFAULT_SEARCH_SETTINGS.minLiquidity,
    );
  });

  it("handles localStorage errors gracefully during update", () => {
    // Only throw once to avoid unhandled error in catch block
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error("Quota exceeded");
    });
    // Second call (in catch block) should succeed
    localStorageMock.setItem.mockImplementationOnce(() => {});

    render(
      <SearchSettingsContent
        blockedExchangesCount={0}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    const input = screen.getByTestId("usd-input");
    fireEvent.change(input, { target: { value: "5000" } });

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
  });

  it("sets button state to destructive when all exchanges are blocked", () => {
    render(
      <SearchSettingsContent
        blockedExchangesCount={10}
        totalExchangesCount={10}
        onExchangesClick={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", {
      name: new RegExp(AppTranslationsKeys.EXCHANGES_FILTER_MODAL_TITLE),
    });
    expect(button).toHaveAttribute("data-state", "destructive");
  });
});
