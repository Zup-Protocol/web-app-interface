import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UsdInput } from "./usd-input";

describe("UsdInput", () => {
  it("renders with formatted value", () => {
    render(<UsdInput value="1000" onValueChange={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1 000");
  });

  it("calls onValueChange with raw numeric string when typing", () => {
    const onValueChangeMock = vi.fn();
    render(<UsdInput value="" onValueChange={onValueChangeMock} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "1234" } });
    expect(onValueChangeMock).toHaveBeenCalledWith("1234");
  });

  it("handles empty input", () => {
    const onValueChangeMock = vi.fn();
    render(<UsdInput value="123" onValueChange={onValueChangeMock} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "" } });
    expect(onValueChangeMock).toHaveBeenCalledWith("");
  });

  it("ignores non-numeric input", () => {
    const onValueChangeMock = vi.fn();
    render(<UsdInput value="123" onValueChange={onValueChangeMock} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "abc" } });
    expect(onValueChangeMock).not.toHaveBeenCalled();
  });

  it("handles invalid inputs or NaN", () => {
    const onValueChange = vi.fn();
    render(<UsdInput value="abc" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });
});
