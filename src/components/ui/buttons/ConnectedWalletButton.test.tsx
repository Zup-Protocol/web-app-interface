import {
    act,
    fireEvent,
    render,
    screen
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useConnection } from "wagmi";
import { ConnectedWalletButton } from "./connected-wallet-button";

// Mock dependencies
const mockOpen = vi.fn();
vi.mock("@reown/appkit/react", () => ({
  useAppKit: () => ({
    open: mockOpen,
  }),
}));

vi.mock("wagmi", () => ({
  useConnection: vi.fn(),
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
  const mockAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(useConnection).mockReturnValue({ address: mockAddress } as any);
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

    expect(
      screen.getAllByText("header.buttons.connected").length,
    ).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
  });

  it("handles empty address", () => {
    vi.mocked(useConnection).mockReturnValue({ address: undefined } as any);
    render(<ConnectedWalletButton />);
    // Should not show any address
    expect(screen.queryByText(/0x/)).not.toBeInTheDocument();
  });
});
