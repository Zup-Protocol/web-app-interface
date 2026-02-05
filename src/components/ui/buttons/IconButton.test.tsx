import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./icon-button";

describe("IconButton", () => {
  it("renders children", () => {
    render(
      <IconButton>
        <span data-testid="icon">icon</span>
      </IconButton>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<IconButton variant="secondary">Icon</IconButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary-button-background");
  });

  it("applies size classes", () => {
    render(<IconButton size="lg">Icon</IconButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-12");
  });
});
