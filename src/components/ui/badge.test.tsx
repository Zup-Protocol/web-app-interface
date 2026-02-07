import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./badge";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
  };
});

describe("Badge", () => {
  it("renders dot variant correctly", () => {
    const { container } = render(<Badge variant="dot" />);
    // Should render a span with bg-orange-400
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-orange-400");
  });

  it("renders custom classes", () => {
    const { container } = render(<Badge className="custom-class" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("custom-class");
  });

  it("returns null for unknown variant", () => {
    // @ts-ignore
    const { container } = render(<Badge variant="unknown" />);
    expect(container).toBeEmptyDOMElement();
  });
});
