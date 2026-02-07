import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./search-input";

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    m: {
      button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
      ),
    },
  };
});

vi.mock("./icons/search", () => ({
  SearchIcon: ({ className }: any) => (
    <svg className={className} data-testid="search-icon" />
  ),
}));

describe("SearchInput", () => {
  it("renders correctly", () => {
    render(<SearchInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("handles input change without debounce", () => {
    const onChangeMock = vi.fn();
    render(<SearchInput onChange={onChangeMock} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it("handles input change WITH debounce", async () => {
    vi.useFakeTimers();
    const onChangeMock = vi.fn();
    render(<SearchInput onChange={onChangeMock} debounceTime={500} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });

    // Should not be called immediately
    expect(onChangeMock).not.toHaveBeenCalled();

    // Advance timers
    vi.advanceTimersByTime(500);

    expect(onChangeMock).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("calls onClear when clear button is clicked", () => {
    const onClearMock = vi.fn();
    render(
      <SearchInput
        value="some value"
        onClear={onClearMock}
        onChange={() => {}}
      />,
    );

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(onClearMock).toHaveBeenCalled();
  });

  it("blurs input when Enter is pressed", () => {
    const onKeyDownMock = vi.fn();
    render(<SearchInput onKeyDown={onKeyDownMock} />);
    const input = screen.getByRole("textbox");

    const blurSpy = vi.spyOn(input, "blur");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(blurSpy).toHaveBeenCalled();
    expect(onKeyDownMock).toHaveBeenCalled();
  });
});
