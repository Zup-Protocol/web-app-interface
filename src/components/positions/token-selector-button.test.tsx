import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TokenSelectorButton } from "./token-selector-button";

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

vi.mock("@/components/ui/animations/scale-click-animation", () => ({
  ScaleClickAnimation: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/components/ui/icons/cursor-click", () => {
  const React = require("react");
  return {
    CursorClickIcon: React.forwardRef(({ size }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        startAnimation: vi.fn(),
        stopAnimation: vi.fn(),
      }));
      return <svg data-testid="cursor-click-icon" height={size} />;
    }),
  };
});

describe("TokenSelectorButton", () => {
  it("renders correctly with label", () => {
    render(<TokenSelectorButton label="Select Token" />);
    expect(screen.getByText("Select Token")).toBeInTheDocument();
    expect(screen.getByTestId("cursor-click-icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    render(<TokenSelectorButton label="Select Token" onClick={onClickMock} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalled();
  });

  it("handles hover states correctly", async () => {
    render(<TokenSelectorButton label="Select Token" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
  });
});
