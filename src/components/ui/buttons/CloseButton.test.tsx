import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CloseButton } from "./close-button";

describe("CloseButton", () => {
  it("renders a button", () => {
    render(<CloseButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("uses TertiaryOnModal variant by default", () => {
    render(<CloseButton />);
    const button = screen.getByRole("button");
    // We check for class associated with tertiaryOnModal
    // From icon-button source: "bg-tertiary-button-on-modal-background"
    expect(button).toHaveClass("bg-tertiary-button-on-modal-background");
  });

  it("uses tertiary variant when onBackground", () => {
    render(<CloseButton variant="onBackground" />);
    const button = screen.getByRole("button");
    // From icon-button source: "bg-tertiary-button-background"
    expect(button).toHaveClass("bg-tertiary-button-background");
  });
});
