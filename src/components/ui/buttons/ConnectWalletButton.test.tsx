import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConnectWalletButton } from "./connect-wallet-button";

// Mock dependencies
const mockOpen = vi.fn();
vi.mock("@reown/appkit/react", () => ({
  useAppKit: () => ({
    open: mockOpen,
  }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

vi.mock("@/components/ui/icons/connect", () => {
  const React = require("react");
  return {
    ConnectIcon: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        startAnimation: vi.fn(),
        stopAnimation: vi.fn(),
      }));
      return <div data-testid="connect-icon" />;
    }),
  };
});

// Mock PrimaryButton to check callbacks
vi.mock("./primary-button", () => ({
  PrimaryButton: ({
    children,
    onClick,
    onRevealComplete,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    onPointerLeave,
    ...props
  }: any) => (
    <button
      {...props}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
      data-reveal={!!onRevealComplete}
      data-testid="primary-button-mock"
    >
      {children}
      {onRevealComplete && (
        <div data-testid="reveal-spacer" onClick={onRevealComplete} />
      )}
    </button>
  ),
}));

describe("ConnectWalletButton", () => {
  let matchMediaMatches = false;

  beforeEach(() => {
    mockOpen.mockClear();
    matchMediaMatches = false;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: matchMediaMatches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("renders correctly", () => {
    render(<ConnectWalletButton />);
    expect(screen.getByText("header.buttons.connect")).toBeInTheDocument();
  });

  it("opens appkit on click", () => {
    render(<ConnectWalletButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOpen).toHaveBeenCalledWith({ view: "Connect" });
  });

  it("handles interactions and animations", () => {
    render(<ConnectWalletButton />);
    const button = screen.getByTestId("primary-button-mock");

    // Test onRevealComplete
    const spacer = screen.getByTestId("reveal-spacer");
    fireEvent.click(spacer);

    // Test Pointer events
    fireEvent.pointerDown(button);
    fireEvent.pointerLeave(button);

    // Test Mouse events
    fireEvent.mouseLeave(button);
  });

  it("updates mobile state on resize", () => {
    render(<ConnectWalletButton />);

    // Simulate resize to mobile
    matchMediaMatches = true;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(
      screen.queryByText("header.buttons.connect"),
    ).not.toBeInTheDocument();

    // Simulate resize back to desktop
    matchMediaMatches = false;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(screen.getByText("header.buttons.connect")).toBeInTheDocument();
  });

  it("handles mounted but mobile state", () => {
    matchMediaMatches = true;
    render(<ConnectWalletButton />);
    expect(
      screen.queryByText("header.buttons.connect"),
    ).not.toBeInTheDocument();
  });
});
