import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CogIcon } from "./cog";

// We mock motion/react to avoid actual animation logic complexity in JSDOM
const mockStart = vi.fn();
vi.mock("motion/react", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useAnimation: () => ({
      start: mockStart,
    }),
    motion: {
      ...actual.motion,
      svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
      path: ({ children, ...props }: any) => <path {...props} />,
    },
  };
});

describe("CogIcon", () => {
  it("renders correctly", () => {
    const { container } = render(<CogIcon size={24} />);
    // Check if it renders an svg
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("starts animation on mouse enter", () => {
    const { container } = render(<CogIcon />);
    const div = container.firstChild;

    fireEvent.mouseEnter(div as Element);
    expect(mockStart).toHaveBeenCalledWith("animate");
  });

  it("stops animation on mouse leave", () => {
    const { container } = render(<CogIcon />);
    const div = container.firstChild;

    fireEvent.mouseLeave(div as Element);
    expect(mockStart).toHaveBeenCalledWith("normal");
  });

  it("works with ref for manual control", () => {
    const ref = { current: null as any };
    render(<CogIcon ref={ref} />);

    expect(ref.current.startAnimation).toBeDefined();
    expect(ref.current.stopAnimation).toBeDefined();

    ref.current.startAnimation();
    expect(mockStart).toHaveBeenCalledWith("animate");
  });
});
