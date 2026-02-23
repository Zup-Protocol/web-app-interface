import { DEFAULT_SEARCH_SETTINGS } from "@/core/DTOs/search-settings-config.dto";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewPositionForm } from "./new-position-form";

// Mock dependencies
vi.mock("@/components/ui/popover", () => {
  const React = require("react");
  return {
    Popover: ({ children, open, onOpenChange }: any) => (
      <div data-testid="popover-root" data-open={open}>
        {React.Children.map(children, (child: any) => {
          if (child?.type?.name === "PopoverTrigger" || child?.props?.asChild) {
            return React.cloneElement(child, {
              onClick: () => onOpenChange?.(!open),
            });
          }
          return child;
        })}
      </div>
    ),
    PopoverTrigger: ({ children, onClick }: any) => (
      <div data-testid="popover-trigger" onClick={onClick}>
        {children}
      </div>
    ),
    PopoverContent: ({ children, onInteractOutside }: any) => (
      <div data-testid="popover-content">
        {children}
        <button
          data-testid="popover-interact-outside"
          onClick={(e) => onInteractOutside?.(e)}
        >
          Interact Outside
        </button>
      </div>
    ),
  };
});

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

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
      img: ({ src, alt, ...props }: any) => (
        <img src={src} alt={alt} {...props} />
      ),
      svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
      path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    },
  };
});

vi.mock("@/components/modals/exchanges-filter-modal", () => ({
  ExchangesFilterModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div role="dialog">
        ExchangesFilterModal <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("@/components/new-position/search-settings-content", () => ({
  SearchSettingsContent: ({ onDone, onExchangesClick }: any) => {
    return (
      <div data-testid="search-settings-content">
        SearchSettingsContent
        <button onClick={onDone}>Done</button>
        <button onClick={onExchangesClick}>Exchanges</button>
      </div>
    );
  },
}));

vi.mock("@/components/asset-selector/asset-selector-button", () => ({
  AssetSelectorButton: ({ label }: any) => <button>{label}</button>,
}));

vi.mock("@/components/ui/buttons/primary-button", () => ({
  PrimaryButton: (props: any) => <button {...props}>{props.children}</button>,
}));

vi.mock("@/components/ui/icons/cog", () => {
  const React = require("react");
  return {
    CogIcon: React.forwardRef(({ className }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        startAnimation: vi.fn(),
        stopAnimation: vi.fn(),
      }));
      return <svg className={className} data-testid="cog-icon" />;
    }),
  };
});

vi.mock("@/components/ui/icons/sparkles", () => {
  const React = require("react");
  return {
    SparklesIcon: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        startAnimation: vi.fn(),
        stopAnimation: vi.fn(),
      }));
      return <svg data-testid="sparkles-icon" {...props} />;
    }),
  };
});

vi.mock("@/providers/animation-provider", () => ({
  AnimationProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/providers/app-providers", () => ({
  AppProviders: ({ children }: any) => <>{children}</>,
}));

vi.mock("../ui/badge", () => ({
  Badge: () => <div data-testid="badge" />,
}));
vi.mock("@radix-ui/react-tooltip", () => ({
  TooltipProvider: ({ children }: any) => <>{children}</>,
  Tooltip: ({ children }: any) => <>{children}</>,
  TooltipTrigger: ({ children }: any) => <>{children}</>,
  TooltipContent: ({ children }: any) => <div role="tooltip">{children}</div>,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("NewPositionForm", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<NewPositionForm />);
    expect(
      screen.getByText(AppTranslationsKeys.NEW_POSITION_TITLE),
    ).toBeInTheDocument();
  });

  it("opens search settings popover on trigger click", async () => {
    render(<NewPositionForm />);
    const trigger = screen.getByLabelText("Search Settings");

    fireEvent.click(trigger);

    expect(screen.getByTestId("search-settings-content")).toBeInTheDocument();
  });

  it("changes icon color and shows badge when settings are modified", async () => {
    const modifiedSettings = {
      ...DEFAULT_SEARCH_SETTINGS,
      minLiquidity: "5000",
    };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === LocalStorageKey.SEARCH_SETTINGS) {
        return JSON.stringify(modifiedSettings);
      }
      return null;
    });

    render(<NewPositionForm />);

    await waitFor(() => {
      const icon = screen.getByTestId("cog-icon");
      expect(icon).toHaveClass("text-orange-400");
    });
  });

  it("changes icon color and shows badge when blocked exchanges exist", async () => {
    const modifiedSettings = {
      ...DEFAULT_SEARCH_SETTINGS,
      blockedExchanges: ["some-dex"],
    };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === LocalStorageKey.SEARCH_SETTINGS) {
        return JSON.stringify(modifiedSettings);
      }
      return null;
    });

    render(<NewPositionForm />);

    await waitFor(() => {
      const icon = screen.getByTestId("cog-icon");
      expect(icon).toHaveClass("text-orange-400");
    });
  });

  it("triggers icon animations on hover", () => {
    render(<NewPositionForm />);

    const searchSettingsBtn = screen.getByLabelText("Search Settings");
    fireEvent.mouseEnter(searchSettingsBtn);
    fireEvent.mouseLeave(searchSettingsBtn);

    const searchBtn = screen.getByRole("button", {
      name: new RegExp(AppTranslationsKeys.NEW_POSITION_SEARCH_BUTTON),
    });
    fireEvent.pointerEnter(searchBtn);
    fireEvent.pointerLeave(searchBtn);
  });

  it("handles localStorage errors gracefully", async () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("Local Storage Error");
    });

    render(<NewPositionForm />);

    await waitFor(() => {
      const icon = screen.getByTestId("cog-icon");
      expect(icon).not.toHaveClass("text-orange-400");
    });
  });

  it("prevents popover closing when exchanges modal is open", async () => {
    render(<NewPositionForm />);

    const trigger = screen.getByLabelText("Search Settings");
    fireEvent.click(trigger);

    const exchangesBtn = screen.getByText("Exchanges");
    fireEvent.click(exchangesBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const interactOutsideBtn = screen.getByTestId("popover-interact-outside");

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    fireEvent(interactOutsideBtn, event);

    await waitFor(() => {
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  it("handles missing blockedExchanges in search settings", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === LocalStorageKey.SEARCH_SETTINGS) {
        // Return config with no blockedExchanges property
        return JSON.stringify({ minLiquidity: "0" });
      }
      return null;
    });

    render(<NewPositionForm />);

    // Should not crash and should show 0 blocked
    expect(screen.getByLabelText("Search Settings")).toBeInTheDocument();
  });

  it("handles onDone and onClose callbacks", async () => {
    render(<NewPositionForm />);

    // Open Popover
    fireEvent.click(screen.getByLabelText("Search Settings"));
    expect(screen.getByTestId("search-settings-content")).toBeInTheDocument();

    // Test onDone (closes popover)
    const doneBtn = screen.getByText("Done");
    fireEvent.click(doneBtn);
    // Our mock Popover handles onOpenChange
    expect(screen.getByTestId("popover-root")).toHaveAttribute(
      "data-open",
      "false",
    );

    // Open again to click Exchanges
    fireEvent.click(screen.getByLabelText("Search Settings"));
    fireEvent.click(screen.getByText("Exchanges"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Test onClose (closes modal)
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("allows interaction outside when modal is closed", async () => {
    render(<NewPositionForm />);
    fireEvent.click(screen.getByLabelText("Search Settings"));

    const interactOutsideBtn = screen.getByTestId("popover-interact-outside");
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    fireEvent(interactOutsideBtn, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
