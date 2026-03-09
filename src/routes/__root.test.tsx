import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RootComponent } from "./__root";

// Mock Tanstack Router
vi.mock("@tanstack/react-router", () => ({
  createRootRoute: () => () => ({
    component: vi.fn(),
  }),
  Outlet: () => <div data-testid="outlet" />,
}));

// Mock components
vi.mock("@/components/header", () => ({ Header: () => <div data-testid="header" /> }));
vi.mock("@/components/common/locale-initializer", () => ({ LocaleInitializer: () => <div data-testid="locale-initializer" /> }));
vi.mock("@tanstack/router-devtools", () => ({ TanStackRouterDevtools: () => <div data-testid="router-devtools" /> }));

describe("RootComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    // @ts-ignore
    import.meta.env.DEV = true;
    render(<RootComponent />);
    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("locale-initializer")).toBeDefined();
    expect(screen.getByTestId("outlet")).toBeDefined();
  });
});
