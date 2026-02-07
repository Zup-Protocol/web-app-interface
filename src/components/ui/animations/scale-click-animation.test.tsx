import { triggerHaptic } from "@/lib/haptic";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  });

  it("handles pointer up and cancel", () => {
    const onPointerUp = vi.fn();
    const onPointerCancel = vi.fn();
    render(
      <ScaleClickAnimation
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        Content
      </ScaleClickAnimation>,
    );

    const content = screen.getByText("Content");
    fireEvent.pointerUp(content);
    expect(onPointerUp).toHaveBeenCalled();

    fireEvent.pointerCancel(content);
    expect(onPointerCancel).toHaveBeenCalled();
  });

  it("renders as child component", () => {
    render(
      <ScaleClickAnimation asChild>
        <button>Click me</button>
      </ScaleClickAnimation>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
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
  });

  it("handles non-object animate prop", () => {
    render(
      <ScaleClickAnimation animate={"string" as any}>
        <div>Content</div>
      </ScaleClickAnimation>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
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
  });

  it("handles custom transition and style props", () => {
    render(
      <ScaleClickAnimation
        transition={{ duration: 0.5 }}
        style={{ color: "red" }}
      >
        <div>Content</div>
      </ScaleClickAnimation>,
    );
    const content = screen.getByText("Content");
    fireEvent.pointerDown(content);
    fireEvent.pointerUp(content);
  });

  it("handles non-object transition prop", () => {
    render(
      <ScaleClickAnimation transition={"string" as any}>
        <div>Content</div>
      </ScaleClickAnimation>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
