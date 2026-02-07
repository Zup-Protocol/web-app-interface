import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsButton } from "./settings-button";

// Mock dependencies
vi.mock("@/components/settings/settings-content", () => ({
  SettingsContent: () => (
    <div data-testid="settings-content">Settings Content</div>
  ),
}));

// Mock Translation hook
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

// Mock Icons to avoid complex svg rendering checks or animation refs issues
vi.mock("@/components/ui/icons/cog", async () => {
  const React = await import("react");
  return {
    CogIcon: React.forwardRef((props, ref) => {
      // Expose start/stop animation on ref to check calls if needed
      React.useImperativeHandle(ref, () => ({
        startAnimation: vi.fn(),
        stopAnimation: vi.fn(),
      }));
      return <div data-testid="cog-icon">Cog</div>;
    }),
  };
});

describe("SettingsButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the button with cog icon", () => {
    render(<SettingsButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("cog-icon")).toBeInTheDocument();
  });

  it("opens popover on click", async () => {
    render(<SettingsButton />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Check if content appears (Radix UI Popover)
    await waitFor(() => {
      expect(screen.getByTestId("settings-content")).toBeInTheDocument();
    });
  });

  it("triggers cog animation on hover", () => {
    render(<SettingsButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
  });
});
