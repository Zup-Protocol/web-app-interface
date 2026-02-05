import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { PrimaryButton } from "./primary-button";

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: matchMediaMock,
  });
});

describe("PrimaryButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("renders correctly with children", () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);

    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("works with asChild and triggers hover events via Slot", () => {
    const onRevealComplete = vi.fn();
    const onMouseEnter = vi.fn();

    render(
      <PrimaryButton
        asChild
        onRevealComplete={onRevealComplete}
        onMouseEnter={onMouseEnter}
      >
        <button data-testid="child-btn">As Child</button>
      </PrimaryButton>,
    );

    const button = screen.getByTestId("child-btn");

    // Fire mouseEnter on the button. Since it is slotted, it should trigger the onMouseEnter merged by PrimaryButton.
    fireEvent.mouseEnter(button);

    expect(onMouseEnter).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(onRevealComplete).toHaveBeenCalled();

    fireEvent.mouseLeave(button);
  });

  it("shows icon on mobile", () => {
    matchMediaMock.mockReturnValue({
      matches: true, // mobile
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <PrimaryButton icon={<span data-testid="test-icon" />}>
        Mobile
      </PrimaryButton>,
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });
});
