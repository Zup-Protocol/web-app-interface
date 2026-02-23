import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StateDisplay } from "./state-display";

// Mock framer-motion
vi.mock("framer-motion", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe("StateDisplay", () => {
  it("renders title and description", () => {
    render(<StateDisplay title="Empty State" description="Nothing here" />);
    expect(screen.getByText("Empty State")).toBeInTheDocument();
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders image if provided", () => {
    const { container } = render(
      <StateDisplay title="Image State" image="test.png" />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test.png");
  });

  it("renders image from object", () => {
    const { container } = render(
      <StateDisplay title="Image State" image={{ src: "test-obj.png" }} />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "test-obj.png");
  });
});

it("renders button if provided", () => {
  render(
    <StateDisplay
      title="Button State"
      button={<button data-testid="test-button">Click me</button>}
    />,
  );
  expect(screen.getByTestId("test-button")).toBeInTheDocument();
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
