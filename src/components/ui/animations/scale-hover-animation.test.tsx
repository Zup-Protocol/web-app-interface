import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScaleHoverAnimation } from "./scale-hover-animation";

// Mock dependencies
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    m: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe("ScaleHoverAnimation", () => {
  it("renders correctly", () => {
    render(<ScaleHoverAnimation>Content</ScaleHoverAnimation>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("handles hover events", () => {
    const onMouseEnterMock = vi.fn();
    const onMouseLeaveMock = vi.fn();

    render(
      <ScaleHoverAnimation
        onPointerEnter={onMouseEnterMock}
        onPointerLeave={onMouseLeaveMock}
      >
        Content
      </ScaleHoverAnimation>,
    );

    const content = screen.getByText("Content");
    fireEvent.pointerEnter(content);
    expect(onMouseEnterMock).toHaveBeenCalled();

    fireEvent.pointerLeave(content);
    expect(onMouseLeaveMock).toHaveBeenCalled();
  });

  it("renders as child", () => {
    render(
      <ScaleHoverAnimation asChild>
        <button>Click me</button>
      </ScaleHoverAnimation>,
    );
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("does not apply animation when disabled", () => {
    const onPointerEnter = vi.fn();
    render(
      <ScaleHoverAnimation disabled onPointerEnter={onPointerEnter}>
        Content
      </ScaleHoverAnimation>,
    );
    const content = screen.getByText("Content");
    fireEvent.pointerEnter(content);
    expect(onPointerEnter).toHaveBeenCalled();
  });

  it("handles custom animation props", () => {
    render(
      <ScaleHoverAnimation animate={{ opacity: 0.5 }}>
        Content
      </ScaleHoverAnimation>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("handles non-object animate and transition props", () => {
    render(
      <ScaleHoverAnimation
        animate={"string" as any}
        transition={"string" as any}
      >
        Content
      </ScaleHoverAnimation>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("uses scale from animate prop if provided", () => {
    render(
      <ScaleHoverAnimation animate={{ scale: 2 }}>Content</ScaleHoverAnimation>,
    );
    const content = screen.getByText("Content");
    fireEvent.pointerEnter(content);
    fireEvent.pointerLeave(content);
    expect(content).toBeInTheDocument();
  });
});
