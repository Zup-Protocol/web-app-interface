import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "./brand-logo";

describe("BrandLogo", () => {
  it("renders correctly", () => {
    const { container } = render(<BrandLogo />);
    // It renders an anchor with href="/"
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");

    // Should contain images for logo
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute("alt", "Zup Protocol");
  });
});
