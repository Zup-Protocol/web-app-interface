import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeHeroSection } from "./home-hero-section";

// Mock Providers
vi.mock("@/providers/animation-provider", () => ({
  AnimationProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock framer-motion
vi.mock("framer-motion", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
  };
});

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
  }),
}));

// Mock PrimaryButton to avoid deep render issues with Slot/Framer
vi.mock("@/components/ui/buttons/primary-button", () => ({
  PrimaryButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("HomeHeroSection", () => {
  it("renders content", () => {
    render(<HomeHeroSection />);
    expect(screen.getByText("hero.title")).toBeInTheDocument();
    expect(screen.getByText("hero.subtitle")).toBeInTheDocument();
  });

  it("triggers alert on click", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<HomeHeroSection />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(alertMock).toHaveBeenCalledWith("hero.welcome");
    alertMock.mockRestore();
  });
});
