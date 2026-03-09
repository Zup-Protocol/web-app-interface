import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./header";

// Mock wagmi
vi.mock("wagmi", () => ({
  useConnection: vi.fn(() => ({ isConnected: false })),
  useAccount: vi.fn(() => ({ address: "0x123", isConnected: false })),
  useChainId: vi.fn(() => 1),
  useConfig: vi.fn(),
  useSwitchChain: vi.fn(() => ({ switchChain: vi.fn() })),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock AppProviders to avoid complex provider setup
vi.mock("@/providers/app-providers", () => ({
  AppProviders: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock hooks
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

// Mock sub-components that use complex hooks
vi.mock("./network-selector", () => ({
  NetworkSelector: () => <div data-testid="network-selector">Network</div>,
}));

vi.mock("./ui/buttons/connect-wallet-button", () => ({
  ConnectWalletButton: () => <button>Connect</button>,
}));

vi.mock("./ui/buttons/connected-wallet-button", () => ({
  ConnectedWalletButton: () => <button>Connected</button>,
}));

vi.mock("./ui/buttons/settings-button", () => ({
  SettingsButton: () => <button data-testid="settings-button">Settings</button>,
}));

vi.mock("./brand-logo", () => ({
  BrandLogo: () => <div data-testid="brand-logo">Logo</div>,
}));

vi.mock("./ui/icons/plus", () => ({
  PlusIcon: React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      startAnimation: vi.fn(),
      stopAnimation: vi.fn(),
    }));
    return <div data-testid="plus-icon">Plus</div>;
  }),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders brand logo and nav", () => {
    render(<Header />);
    expect(screen.getByTestId("brand-logo")).toBeDefined();
    expect(screen.getByTestId("plus-icon")).toBeDefined();
  });

  it("handles mouse events on tab button", () => {
    render(<Header />);
    const tabBtn = screen.getByText(/positions/i).closest("button");
    if (tabBtn) {
      fireEvent.mouseEnter(tabBtn);
      fireEvent.mouseLeave(tabBtn);
    }
  });

  it("shows connect wallet when not connected", () => {
    render(<Header />);
    expect(screen.getByText(/connect/i)).toBeDefined();
  });
});
