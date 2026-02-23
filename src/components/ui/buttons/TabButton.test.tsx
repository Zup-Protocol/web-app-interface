import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TabButton } from "./tab-button";

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

describe("TabButton", () => {
  it("renders children", () => {
    render(<TabButton>Tab 1</TabButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Tab 1");
  });

  it("applies active styles", () => {
    render(<TabButton isActive>Tab 1</TabButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-foreground");
  });

  it("applies primary active styles", () => {
    render(
      <TabButton isActive activeColor="primary">
        Tab 1
      </TabButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary");
  });

  it("handles hover states", () => {
    render(<TabButton>Hover Tab</TabButton>);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
  });
});
