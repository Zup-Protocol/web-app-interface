import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { TextButton } from "./text-button";

// TextButton uses `motion.button` and `motion.div` from framer-motion
vi.mock("framer-motion", () => {
  const mockMotionElement = (tag: string) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef((props: any, ref: any) => React.createElement(tag, { ...props, ref }));

  const motion = new Proxy({} as any, {
    get: (_target, prop: string) => mockMotionElement(prop),
  });

  return { motion, m: motion, AnimatePresence: ({ children }: any) => <>{children}</> };
});

// ScaleClickAnimation wraps with pointer-event logic; bypass it in unit tests
vi.mock("../animations/scale-click-animation", () => ({
  ScaleClickAnimation: ({ children }: any) => <>{children}</>,
}));

describe("TextButton", () => {
  it("renders correctly and handles clicks", () => {
    const onClick = vi.fn();
    render(<TextButton onClick={onClick}>Click me</TextButton>);

    const button = screen.getByText("Click me");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not handle clicks when disabled", () => {
    const onClick = vi.fn();
    render(
      <TextButton onClick={onClick} disabled>
        Disabled
      </TextButton>,
    );

    const button = screen.getByText("Disabled");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("renders with icon", () => {
    render(<TextButton icon={<span data-testid="icon" />}>With Icon</TextButton>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
