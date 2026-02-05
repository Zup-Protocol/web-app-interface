import { fireEvent, render, screen } from "@testing-library/react";
import React, { useImperativeHandle } from "react";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./search-input";

// Mock SearchIcon to test animation calls
vi.mock("./icons/search", () => ({
  SearchIcon: React.forwardRef((props: any, ref) => {
    useImperativeHandle(ref, () => ({
      startAnimation: vi.fn(),
      stopAnimation: vi.fn(),
    }));
    return <div data-testid="search-icon" />;
  }),
}));

describe("SearchInput", () => {
  it("renders correctly", () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows clear button when value is present", () => {
    render(<SearchInput value="test" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not show clear button when empty", () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", () => {
    const onClear = vi.fn();
    render(<SearchInput value="test" onClear={onClear} onChange={vi.fn()} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClear).toHaveBeenCalled();
  });

  it("handles focus and blur events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <SearchInput placeholder="Search..." onFocus={onFocus} onBlur={onBlur} />,
    );
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });

  it("handles mouse hover events", () => {
    const { container } = render(<SearchInput placeholder="Search..." />);
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
  });
});
