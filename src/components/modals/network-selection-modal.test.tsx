import { AppNetworks } from "@/lib/app-networks";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkSelectionModal } from "./network-selection-modal";

// Mock dependencies
vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

vi.mock("../ui/modal", () => ({
  Modal: ({ isOpen, children }: any) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock("../ui/buttons/close-button", () => ({
  CloseButton: ({ onClick }: any) => <button onClick={onClick}>Close</button>,
}));

vi.mock("../ui/search-input", () => ({
  SearchInput: ({ value, onChange, onClear }: any) => (
    <div>
      <input data-testid="search-input" value={value} onChange={onChange} />
      <button onClick={onClear} data-testid="clear-btn">
        Clear
      </button>
    </div>
  ),
}));

vi.mock("../ui/cards/network-card", () => ({
  NetworkCard: ({ name, onClick }: any) => (
    <button onClick={onClick}>{name}</button>
  ),
}));

vi.mock("../ui/state-display", () => ({
  StateDisplay: () => <div>No networks found</div>,
}));

// Mock AppNetworksUtils to return predictable data
vi.mock("@/lib/app-networks", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-ignore
    ...actual,
    AppNetworksUtils: {
      // @ts-ignore
      ...actual.AppNetworksUtils,
      values: ["ethereum", "optimism"],
      getTranslatedNetworkName: (id: string) =>
        id.charAt(0).toUpperCase() + id.slice(1),
    },
  };
});

describe("NetworkSelectionModal", () => {
  const onCloseMock = vi.fn();
  const onSelectNetworkMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open", () => {
    render(
      <NetworkSelectionModal
        isOpen={true}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <NetworkSelectionModal
        isOpen={false}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("displays networks", () => {
    render(
      <NetworkSelectionModal
        isOpen={true}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );
    // Mocked values are Ethereum, Optimism
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("Optimism")).toBeInTheDocument();
  });

  it("filters networks based on search", () => {
    render(
      <NetworkSelectionModal
        isOpen={true}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Optimism" } });

    expect(screen.getByText("Optimism")).toBeInTheDocument();
    expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();
  });

  it("shows empty state when no matches", () => {
    render(
      <NetworkSelectionModal
        isOpen={true}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "NonExistent" } });

    expect(screen.getByText("No networks found")).toBeInTheDocument();
  });

  it("clears search input", () => {
    render(
      <NetworkSelectionModal
        isOpen={true}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Search" } });
    expect(input).toHaveValue("Search");

    const clearBtn = screen.getByTestId("clear-btn");
    fireEvent.click(clearBtn);

    expect(input).toHaveValue("");
  });

  it("selects a network and closes", () => {
    render(
      <NetworkSelectionModal
        isOpen={true}
        onClose={onCloseMock}
        currentNetwork={AppNetworks.ETHEREUM}
        onSelectNetwork={onSelectNetworkMock}
      />,
    );

    fireEvent.click(screen.getByText("Optimism"));

    // We expect it to call onSelectNetwork with the ID "optimism"
    expect(onSelectNetworkMock).toHaveBeenCalledWith("optimism");
    expect(onCloseMock).toHaveBeenCalled();
  });
});
