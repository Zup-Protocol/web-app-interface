import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabButton } from "./tab-button";

describe("TabButton", () => {
  it("renders children", () => {
    render(<TabButton>Tab 1</TabButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Tab 1");
  });

  it("applies active styles", () => {
    render(<TabButton isActive>Tab 1</TabButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-foreground");
  });
});
