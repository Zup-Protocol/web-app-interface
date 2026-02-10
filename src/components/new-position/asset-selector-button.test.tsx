import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AssetSelectorButton } from "../asset-selector/asset-selector-button";

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

describe("AssetSelectorButton", () => {
  it("renders correctly with label", () => {
    render(<AssetSelectorButton label="Select Asset" />);
    expect(screen.getByText("Select Asset")).toBeInTheDocument();
    expect(screen.getByTestId("cursor-click-icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    render(<AssetSelectorButton label="Select Asset" onClick={onClickMock} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalled();
  });

  it("handles hover states correctly", async () => {
    render(<AssetSelectorButton label="Select Asset" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
  });
});
