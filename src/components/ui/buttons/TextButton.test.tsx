import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { TextButton } from "./text-button";

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
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
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

// Mock ScaleClickAnimation
vi.mock("../animations/scale-click-animation", () => ({
  ScaleClickAnimation: ({ children }: { children: React.ReactNode }) =>
    children,
}));

describe("TextButton", () => {
  it("renders children correctly", () => {
    render(<TextButton>Click me</TextButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("renders icon if provided", () => {
    const TestIcon = () => <span data-testid="test-icon">icon</span>;
    render(<TextButton icon={<TestIcon />}>Button with Icon</TextButton>);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("handles hover states and triggers icon animation", () => {
    const startAnimation = vi.fn();
    const stopAnimation = vi.fn();

    // Create a mock icon component with a ref handle
    const MockIcon = React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        startAnimation,
        stopAnimation,
      }));
      return <span data-testid="mock-icon" />;
    });

    render(<TextButton icon={<MockIcon />}>Hover me</TextButton>);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(startAnimation).toHaveBeenCalled();

    fireEvent.mouseLeave(button);
    expect(stopAnimation).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<TextButton className="custom-class">Classy Button</TextButton>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("passes other button props correctly", () => {
    const onClick = vi.fn();
    render(
      <TextButton onClick={onClick} disabled>
        Click me
      </TextButton>,
    );
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
