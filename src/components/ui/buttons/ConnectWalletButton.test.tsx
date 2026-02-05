import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConnectWalletButton } from "./connect-wallet-button";

// Mock dependencies
const mockOpen = vi.fn();
vi.mock("@reown/appkit/react", () => ({
  useAppKit: () => ({
    open: mockOpen,
  }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

describe("ConnectWalletButton", () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it("renders correctly", () => {
    render(<ConnectWalletButton />);
    // Check if text is present (mocked translation returns key)
    expect(screen.getByText("header.buttons.connect")).toBeInTheDocument();
  });

  it("opens appkit on click", () => {
    render(<ConnectWalletButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOpen).toHaveBeenCalledWith({ view: "Connect" });
  });

  it("hides text on mobile", () => {
    // We rely on standard matchMedia mock which is matches: false.
    // To test mobile, we need to override the mock implementation for this test or use a different describe block.
    // Since matchMedia is global, we override window.matchMedia

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ConnectWalletButton />);
    expect(
      screen.queryByText("header.buttons.connect"),
    ).not.toBeInTheDocument();

    // cleanup
    window.matchMedia = originalMatchMedia;
  });
});
