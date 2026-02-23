import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { RefreshIcon } from "./refresh";

// Mock framer-motion
const mockStart = vi.fn().mockResolvedValue(undefined);
vi.mock("framer-motion", () => {
  return {
    motion: {
      svg: (props: any) => <div data-testid="mock-svg" {...props} />,
      path: (props: any) => <div data-testid="mock-path" {...props} />,
    },
    useAnimation: () => ({
      start: mockStart,
      stop: vi.fn(),
      subscribe: vi.fn(() => () => {}),
    }),
    AnimatePresence: ({ children }: any) => children,
  };
});

describe("RefreshIcon", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<RefreshIcon size={24} />);
    expect(getByTestId("mock-svg")).toBeInTheDocument();
  });

  it("starts animation on mouse enter", () => {
    const { container } = render(<RefreshIcon />);
    const div = container.firstChild;

    fireEvent.mouseEnter(div as Element);
    expect(mockStart).toHaveBeenCalledWith("animate");
  });

  it("stops animation on mouse leave and returns to normal", () => {
    const { container } = render(<RefreshIcon />);
    const div = container.firstChild;

    fireEvent.mouseLeave(div as Element);
    expect(mockStart).toHaveBeenCalledWith("normal");
  });

  it("works with ref for manual control", () => {
    const ref = React.createRef<any>();
    render(<RefreshIcon ref={ref} />);

    expect(ref.current.startAnimation).toBeDefined();
    expect(ref.current.stopAnimation).toBeDefined();

    ref.current.startAnimation();
    expect(mockStart).toHaveBeenCalledWith("animate");
  });
});
