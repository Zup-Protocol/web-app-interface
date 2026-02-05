import { ThemeMode } from "@/lib/theme-mode";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsContent } from "./settings-content";

// Mock dependencies
const mockSetTheme = vi.fn();
const mockSetLocale = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    resolvedTheme: "light",
    systemTheme: "light",
    setTheme: mockSetTheme,
  }),
}));

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({
    translate: (key: string) => key,
    locale: "en",
    setLocale: mockSetLocale,
  }),
}));

// Mock Dropdown to make testing simpler
vi.mock("@/components/ui/dropdown", () => ({
  Dropdown: ({ items, onSelect, selected }: any) => (
    <div data-testid="dropdown">
      {items.map((item: any) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          data-selected={item.value === selected}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

describe("SettingsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Mock startViewTransition
    (document as any).startViewTransition = vi.fn((cb) => cb());
  });

  it("renders theme and language sections", () => {
    render(<SettingsContent />);
    expect(screen.getByText("settings.theme.title")).toBeInTheDocument();
    expect(screen.getByText("settings.language.title")).toBeInTheDocument();
  });

  it("changes theme with transition delay", async () => {
    render(<SettingsContent />);

    // Find Dark option
    const darkBtn = screen.getByText("settings.theme.dark");
    fireEvent.click(darkBtn);

    // Theme shouldn't be set immediately due to setTimeout(..., 300)
    expect(mockSetTheme).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockSetTheme).toHaveBeenCalledWith(ThemeMode.DARK);
  });

  it("changes locale immediately", () => {
    render(<SettingsContent />);

    // Find Spanish option (assuming it's in the list)
    const esBtn = screen.getByText("settings.language.es");
    fireEvent.click(esBtn);

    expect(mockSetLocale).toHaveBeenCalledWith("es");
  });
});
