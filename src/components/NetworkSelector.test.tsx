import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkSelector } from "./network-selector";

// Mock dependencies
const mockSetNetwork = vi.fn();
// Mock hook implementation
const mockNetwork = "ethereum"; // lowercase id assumption or enum value? AppNetworks usually enum

// Assuming AppNetworks works similarly to AppLanguages
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

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

// Mock AppNetworksUtils.
// However, since it is a static class using valid logic, we might use real one if available.
// But to isolate, we can mock it.
vi.mock("@/lib/app-networks", () => ({
  AppNetworksUtils: {
    logoSvg: {
      ethereum: { light: "eth.svg", dark: "eth-dark.svg" },
    },
    getTranslatedNetworkName: (network: string) => `Name: ${network}`,
  },
}));

// Mock NetworkSelectionModal to avoid complex rendering
vi.mock("./modals/network-selection-modal", () => ({
  NetworkSelectionModal: ({ isOpen, onSelectNetwork }: any) =>
    isOpen ? (
      <div data-testid="network-modal">
        ModalOpen{" "}
        <button onClick={() => onSelectNetwork("polygon")}>
          Select Polygon
        </button>
      </div>
    ) : null,
}));

describe("NetworkSelector", () => {
  beforeEach(() => {
    mockSetNetwork.mockClear();
  });

  it("renders current network name and icon", () => {
    render(<NetworkSelector />);
    expect(screen.getByText("Name: ethereum")).toBeInTheDocument();
    // Icon
    const img = screen.getByAltText("Network");
    expect(img).toHaveAttribute("src", "eth.svg");
  });

  it("opens modal on click", () => {
    render(<NetworkSelector />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByTestId("network-modal")).toBeInTheDocument();
  });

  it("selects network via modal interaction", () => {
    render(<NetworkSelector />);
    fireEvent.click(screen.getByRole("button")); // open

    const selectBtn = screen.getByText("Select Polygon");
    fireEvent.click(selectBtn);

    expect(mockSetNetwork).toHaveBeenCalledWith("polygon");
  });
});
