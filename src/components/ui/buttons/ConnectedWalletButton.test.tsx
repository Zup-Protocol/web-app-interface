import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConnectedWalletButton } from "./connected-wallet-button";

// Mock dependencies
const mockOpen = vi.fn();
vi.mock("@reown/appkit/react", () => ({
  useAppKit: () => ({
    open: mockOpen,
  }),
  useAppKitAccount: () => ({
    address: "0x1234567890123456789012345678901234567890",
    isConnected: true,
  }),
}));

const mockAddress = "0x1234567890123456789012345678901234567890";
vi.mock("wagmi", () => ({
  useConnection: () => ({
    address: mockAddress,
  }),
  useEnsName: () => ({
    data: null,
  }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

vi.mock("react-nice-avatar", () => ({
  default: () => <div data-testid="avatar" />,
  genConfig: () => ({}),
}));

describe("ConnectedWalletButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders correct address format when no ENS", () => {
    render(<ConnectedWalletButton />);
    expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
  });

  it("opens account view on click", () => {
    render(<ConnectedWalletButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOpen).toHaveBeenCalledWith({ view: "Account" });
  });

  it("shows success state initially then normal state", () => {
    render(<ConnectedWalletButton />);

    // success state shows header.buttons.connected key (multiple due to layout hacks)
    expect(
      screen.getAllByText("header.buttons.connected").length,
    ).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    waitFor(() => {
      expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
    });
  });
});
