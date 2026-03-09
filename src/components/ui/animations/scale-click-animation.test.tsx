import { triggerHaptic } from "@/lib/haptic";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScaleClickAnimation } from "./scale-click-animation";

// Mock dependencies
vi.mock("@/lib/haptic", () => ({
  triggerHaptic: vi.fn(),
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    m: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe("ScaleClickAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders correctly", () => {
    render(<ScaleClickAnimation>Content</ScaleClickAnimation>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("triggers haptic on pointer down", () => {
    render(<ScaleClickAnimation>Content</ScaleClickAnimation>);

    // Simulate pointer events
    const content = screen.getByText("Content");
    fireEvent.pointerDown(content);

    expect(triggerHaptic).toHaveBeenCalledWith(10);

    act(() => {
      vi.runAllTimers();
    });
  });

  it("handles pointer up and cancel", () => {
    const onPointerUp = vi.fn();
    const onPointerCancel = vi.fn();
    render(
      <ScaleClickAnimation onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
        Content
      </ScaleClickAnimation>,
    );

    const content = screen.getByText("Content");
    fireEvent.pointerUp(content);
    expect(onPointerUp).toHaveBeenCalled();

    fireEvent.pointerCancel(content);
    expect(onPointerCancel).toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });
  });

  it("renders as child component", () => {
    render(
      <ScaleClickAnimation asChild>
        <button>Click me</button>
      </ScaleClickAnimation>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });
  });

  it("handles animate prop with scale value", () => {
    render(
      <ScaleClickAnimation animate={{ scale: 1.5 }}>
        <div>Content</div>
      </ScaleClickAnimation>,
    );
    const content = screen.getByText("Content");
    fireEvent.pointerDown(content);
    fireEvent.pointerUp(content);

    act(() => {
      vi.runAllTimers();
    });
  });

  it("handles disabled state", () => {
    render(
      <ScaleClickAnimation disabled>
        <div>Content</div>
      </ScaleClickAnimation>,
    );
    const content = screen.getByText("Content");
    fireEvent.pointerDown(content);
    fireEvent.pointerUp(content);

    act(() => {
      vi.runAllTimers();
    });
  });
});
