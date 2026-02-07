import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InfoTooltip } from "./info-tooltip";

// Mock dependencies
vi.mock("@/components/ui/icons/info", () => {
  const React = require("react");
  return {
    InfoIcon: React.forwardRef(({ size }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        startAnimation: vi.fn(),
        stopAnimation: vi.fn(),
      }));
      return <svg data-testid="info-icon" width={size} />;
    }),
  };
});

vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: vi.fn(),
}));

// Mock Radix Tooltip
vi.mock("@radix-ui/react-tooltip", async () => {
  return {
    Provider: ({ children }: any) => <>{children}</>,
    Root: ({ children }: any) => <>{children}</>,
    Trigger: ({ children }: any) => <>{children}</>,
    Portal: ({ children }: any) => <>{children}</>,
    Content: ({ children }: any) => <div role="tooltip">{children}</div>,
    Arrow: () => <div />,
  };
});

// Mock Popover
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <>{children}</>,
  PopoverTrigger: ({ children }: any) => <>{children}</>,
  PopoverContent: ({ children }: any) => <div role="dialog">{children}</div>,
}));

import { useMediaQuery } from "@/hooks/use-media-query";

describe("InfoTooltip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Tooltip on desktop", () => {
    (useMediaQuery as any).mockReturnValue(true); // Desktop
    render(<InfoTooltip content="Tooltip Content" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("renders Popover on mobile", () => {
    (useMediaQuery as any).mockReturnValue(false); // Mobile
    render(<InfoTooltip content="Mobile Content" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Mobile Content")).toBeInTheDocument();
  });

  it("triggers animation on hover", () => {
    (useMediaQuery as any).mockReturnValue(true);
    render(<InfoTooltip content="Content" />);

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
  });
});
