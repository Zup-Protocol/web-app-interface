import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./header";

// Mock Providers (pass-through)
vi.mock("../providers/theme-provider", () => ({
  ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../providers/web3-provider", () => ({
  Web3Provider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../providers/animation-provider", () => ({
  AnimationProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock framer-motion
vi.mock("framer-motion", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock hooks
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

// Mock wagmi useConnection
const mockIsConnected = vi.fn();
vi.mock("wagmi", () => ({
  useConnection: () => ({
    isConnected: mockIsConnected(),
  }),
  useEnsName: () => ({ data: null }),
}));

// Mock child components to verify composition
vi.mock("./brand-logo", () => ({
  BrandLogo: () => <div data-testid="brand-logo" />,
}));
vi.mock("./network-selector", () => ({
  NetworkSelector: () => <div data-testid="network-selector" />,
}));
vi.mock("./ui/buttons/connect-wallet-button", () => ({
  ConnectWalletButton: () => <button>Connect</button>,
}));
vi.mock("./ui/buttons/connected-wallet-button", () => ({
  ConnectedWalletButton: () => <button>Connected</button>,
}));
vi.mock("./ui/buttons/settings-button", () => ({
  SettingsButton: () => <div data-testid="settings-button" />,
}));
vi.mock("./ui/buttons/tab-button", () => ({
  TabButton: ({ children, onMouseEnter, onMouseLeave }: any) => (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  ),
}));

describe("Header", () => {
  it("renders basic structure", () => {
    mockIsConnected.mockReturnValue(false);
    render(<Header />);
    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
    expect(screen.getByTestId("network-selector")).toBeInTheDocument();
    expect(screen.getByTestId("settings-button")).toBeInTheDocument();

    // TabButton content
    expect(screen.getByText("header.nav.positions")).toBeInTheDocument();
  });

  it("shows Connect button when not connected", () => {
    mockIsConnected.mockReturnValue(false);
    render(<Header />);
    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.queryByText("Connected")).not.toBeInTheDocument();
  });

  it("shows Connected button when connected", () => {
    mockIsConnected.mockReturnValue(true);
    render(<Header />);
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.queryByText("Connect")).not.toBeInTheDocument();
  });

  it("triggers animations on TabButton hover", () => {
    mockIsConnected.mockReturnValue(false);
    render(<Header />);
    const tab = screen.getByText("header.nav.positions").parentElement!;
    fireEvent.mouseEnter(tab);
    fireEvent.mouseLeave(tab);
  });
});
