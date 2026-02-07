import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkSelector } from "./network-selector";

// Mock dependencies
const mockSetNetwork = vi.hoisted(() => vi.fn());
const mockNetwork = vi.hoisted(() => "ethereum");

vi.mock("@/hooks/use-network", () => ({
  useAppNetwork: () => ({
    network: mockNetwork,
    setAppNetwork: mockSetNetwork,
  }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

const mockUseTheme = vi.hoisted(() =>
  vi.fn(() => ({ resolvedTheme: "light" })),
);
vi.mock("next-themes", () => ({
  useTheme: mockUseTheme,
}));

const mockLogoSvg = vi.hoisted(() => ({
  ethereum: { light: "eth.svg" as any, dark: "eth-dark.svg" as any },
}));

vi.mock("@/lib/app-networks", () => ({
  AppNetworksUtils: {
    logoSvg: mockLogoSvg,
    getTranslatedNetworkName: (network: string) => `Name: ${network}`,
  },
}));

vi.mock("./modals/network-selection-modal", () => ({
  NetworkSelectionModal: ({ isOpen, onClose, onSelectNetwork }: any) =>
    isOpen ? (
      <div data-testid="network-modal">
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="modal-select-arbitrum"
          onClick={() => onSelectNetwork("arbitrum")}
        >
          Arbitrum
        </button>
      </div>
    ) : null,
}));

describe("NetworkSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ resolvedTheme: "light" });
    mockLogoSvg.ethereum = { light: "eth.svg", dark: "eth-dark.svg" };
  });

  it("renders current network name and icon", () => {
    render(<NetworkSelector />);
    expect(screen.getByText("Name: ethereum")).toBeInTheDocument();
    const img = screen.getByAltText("Network");
    expect(img).toHaveAttribute("src", "eth.svg");
  });

  it("opens modal on click", () => {
    render(<NetworkSelector />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByTestId("network-modal")).toBeInTheDocument();
  });

  it("renders dark theme icon", () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: "dark" });
    render(<NetworkSelector />);
    const img = screen.getByAltText("Network");
    expect(img).toHaveAttribute("src", "eth-dark.svg");
  });

  it("handles modal lifecycle and selection", () => {
    render(<NetworkSelector />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // The modal should be open now.
    // Our mock for NetworkSelectionModal is:
    // ({ isOpen, onClose, onSelectNetwork }: any) => isOpen ? ( ... ) : null

    const closeBtn = screen.getByTestId("modal-close");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("modal-close")).not.toBeInTheDocument();

    // Re-open and select
    fireEvent.click(button);
    const selectBtn = screen.getByTestId("modal-select-arbitrum");
    fireEvent.click(selectBtn);

    expect(mockSetNetwork).toHaveBeenCalledWith("arbitrum");
  });

  it("handles object icon src (e.g. from static imports)", () => {
    mockLogoSvg.ethereum = {
      light: { src: "eth-obj.svg" },
      dark: { src: "eth-dark-obj.svg" },
    };
    render(<NetworkSelector />);
    const img = screen.getByAltText("Network");
    expect(img).toHaveAttribute("src", "eth-obj.svg");
  });
});
