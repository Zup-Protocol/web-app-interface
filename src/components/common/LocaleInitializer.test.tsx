import { initLocale } from "@/stores/i18n";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleInitializer } from "./locale-initializer";

vi.mock("@/stores/i18n", () => ({
  initLocale: vi.fn(),
}));

describe("LocaleInitializer", () => {
  it("calls initLocale on mount", () => {
    render(<LocaleInitializer />);
    expect(initLocale).toHaveBeenCalled();
  });
});
