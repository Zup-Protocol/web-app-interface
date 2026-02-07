import { fireEvent, render, screen } from "@testing-library/react";
import { useAnimation } from "motion/react";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SlidersHorizontalIcon, SlidersHorizontalIconHandle } from "./sliders";

// Mock motion
vi.mock("motion/react", () => ({
  motion: {
    line: ({ animate, variants, ...props }: any) => (
      <line {...props} data-testid="motion-line" />
    ),
  },
  useAnimation: vi.fn(),
}));

describe("SlidersHorizontalIcon", () => {
  const startMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAnimation as any).mockReturnValue({ start: startMock });
  });

  it("renders correctly", () => {
    render(<SlidersHorizontalIcon />);
    expect(screen.getAllByTestId("motion-line").length).toBeGreaterThan(0);
  });

  it("triggers animation on hover when not controlled (no ref)", () => {
    const startMock = vi.fn();
    (useAnimation as any).mockReturnValue({ start: startMock });

    render(<SlidersHorizontalIcon />);

    const container = screen.getByTestId("sliders-icon");

    fireEvent.mouseEnter(container);
    expect(startMock).toHaveBeenCalledWith("animate");

    fireEvent.mouseLeave(container);
    expect(startMock).toHaveBeenCalledWith("normal");
  });

  it("does not trigger auto animation when controlled (ref passed)", () => {
    const startMock = vi.fn();
    (useAnimation as any).mockReturnValue({ start: startMock });

    const ref = React.createRef<SlidersHorizontalIconHandle>();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    render(
      <SlidersHorizontalIcon
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
    );

    const container = screen.getByTestId("sliders-icon");

    fireEvent.mouseEnter(container);
    // Should call prop but NOT animate
    expect(onMouseEnter).toHaveBeenCalled();
    expect(startMock).not.toHaveBeenCalledWith("animate");

    fireEvent.mouseLeave(container);
    expect(onMouseLeave).toHaveBeenCalled();
    expect(startMock).not.toHaveBeenCalledWith("normal");
  });

  it("exposes controls via ref", () => {
    const startMock = vi.fn();
    (useAnimation as any).mockReturnValue({ start: startMock });

    const ref = React.createRef<SlidersHorizontalIconHandle>();
    render(<SlidersHorizontalIcon ref={ref} />);

    expect(ref.current).toBeTruthy();

    ref.current?.startAnimation();
    expect(startMock).toHaveBeenCalledWith("animate");

    ref.current?.stopAnimation();
    expect(startMock).toHaveBeenCalledWith("normal");
  });
});
