import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrimaryButton } from "./primary-button";

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      button: ({ children, onHoverStart, onHoverEnd, ...props }: any) => (
        <button
          {...props}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          {children}
        </button>
      ),
      div: ({ children, ...props }: any) => (
        <div data-testid="motion-div" {...props}>
          {children}
        </div>
      ),
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
  };
});

vi.mock("../animations/scale-click-animation", () => ({
  ScaleClickAnimation: ({ children, disabled }: any) => (
    <div data-disabled-anim={disabled}>{children}</div>
  ),
}));

vi.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe("PrimaryButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders with children", () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("handles different destructive variants", () => {
    const { rerender } = render(
      <PrimaryButton state="destructive" variant="secondary">
        Destructive Sec
      </PrimaryButton>,
    );
    expect(screen.getByRole("button")).toHaveClass(
      "bg-destructive-secondary-button-background",
    );

    rerender(
      <PrimaryButton state="destructive" variant="outline">
        Destructive Out
      </PrimaryButton>,
    );
    expect(screen.getByRole("button")).toHaveClass("border-red-500/30");
  });

  it("renders icon when alwaysIcon is true", () => {
    render(
      <PrimaryButton icon={<span data-testid="icon">icon</span>} alwaysIcon>
        Label
      </PrimaryButton>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("calls onRevealComplete after delay when hovered", async () => {
    vi.useFakeTimers();
    const onRevealComplete = vi.fn();

    render(
      <PrimaryButton onRevealComplete={onRevealComplete}>Label</PrimaryButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    vi.advanceTimersByTime(120);
    expect(onRevealComplete).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("handles asChild with Slot", () => {
    const onMouseEnter = vi.fn();
    render(
      <PrimaryButton asChild onMouseEnter={onMouseEnter}>
        <a href="#" data-testid="link-button">
          Link Button
        </a>
      </PrimaryButton>,
    );

    const button = screen.getByTestId("link-button");
    fireEvent.mouseEnter(button);
    expect(onMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(button);
  });

  it("prevents interactions when disabled", () => {
    render(<PrimaryButton variant="disabled">Disabled</PrimaryButton>);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
  });

  it("updates mobile state on window resize", () => {
    render(<PrimaryButton>Resize Test</PrimaryButton>);

    act(() => {
      // Mock mobile matchMedia
      (window.matchMedia as any).mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("handles different variants based on state", () => {
    render(<PrimaryButton state="destructive" />);
    expect(screen.getByRole("button")).toHaveClass("bg-red-400");
  });

  it("handles mouse events in asChild mode when not disabled", () => {
    render(
      <PrimaryButton asChild>
        <div data-testid="test-div">Test</div>
      </PrimaryButton>,
    );
    const div = screen.getByTestId("test-div");
    fireEvent.mouseEnter(div);
    fireEvent.mouseLeave(div);
  });
});
