import { AppNetworks } from "@/lib/app-networks";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NetworkCard } from "./network-card";

// Mock framer-motion
vi.mock("framer-motion", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      button: ({
        children,
        onMouseEnter,
        whileHover,
        whileTap,
        ...props
      }: any) => (
        <button {...props} onMouseEnter={onMouseEnter}>
          {children}
        </button>
      ),
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useAnimation: () => ({
      start: vi.fn(),
      set: vi.fn(),
    }),
  };
});

describe("NetworkCard", () => {
  it("renders with name and background style", () => {
    render(<NetworkCard network={AppNetworks.ETHEREUM} name="Ethereum" />);
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    const button = screen.getByRole("button");
    // Check if colors are applied (ETHEREUM has brandColor: "#343434")
    expect(button).toHaveStyle({ backgroundColor: "rgb(52, 52, 52)" });
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <NetworkCard network={AppNetworks.BASE} name="Base" onClick={onClick} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("shows checkmark when selected", () => {
    const { container } = render(
      <NetworkCard
        network={AppNetworks.ETHEREUM}
        name="Ethereum"
        isSelected={true}
      />,
    );
    const checkmark = container.querySelector(".absolute.top-5.right-5");
    expect(checkmark).toBeInTheDocument();
  });

  it("triggers animation on mouse enter", () => {
    render(<NetworkCard network={AppNetworks.ETHEREUM} name="Ethereum" />);
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
  });
});
