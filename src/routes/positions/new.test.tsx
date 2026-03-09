import { useLocation } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewPositionComponent } from "./new";

// Mock Tanstack Router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({
    component: vi.fn(),
  }),
  useLocation: vi.fn(),
  Outlet: () => <div data-testid="outlet" />,
}));

// Mock NewPositionForm
vi.mock("@/components/new-position/new-position-form", () => ({
  NewPositionForm: () => <div data-testid="new-position-form" />,
}));

describe("NewPositionComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly on the main page", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/positions/new" } as any);
    render(<NewPositionComponent />);

    expect(screen.getByTestId("new-position-form")).toBeDefined();
    const formContainer = screen.getByTestId("new-position-form").parentElement;
    expect(formContainer?.className).toContain("opacity-100");
  });

  it("sets opacity to 0 when on /pools page", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/positions/new/pools" } as any);
    render(<NewPositionComponent />);

    const formContainer = screen.getByTestId("new-position-form").parentElement;
    expect(formContainer?.className).toContain("opacity-0");
    expect(formContainer?.className).toContain("pointer-events-none");
  });
});
