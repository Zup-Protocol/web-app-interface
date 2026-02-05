import { AppLanguages } from "@/lib/app-languages";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $currentLocale, defaultLocale, initLocale, setLocale } from "./i18n";

describe("i18n store", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    vi.stubGlobal("navigator", {
      language: "en-US",
    });
    document.documentElement.lang = "";
    $currentLocale.set(defaultLocale);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets locale and updates document lang", () => {
    setLocale({ locale: AppLanguages.SPANISH });
    expect($currentLocale.get()).toBe(AppLanguages.SPANISH);
    expect(document.documentElement.lang).toBe(AppLanguages.SPANISH);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LocalStorageKey.LOCALE,
      AppLanguages.SPANISH,
    );
  });

  it("handles system locale", () => {
    vi.stubGlobal("navigator", { language: "es-ES" });
    setLocale({ locale: AppLanguages.SYSTEM });
    expect($currentLocale.get()).toBe(AppLanguages.SYSTEM);
    // Should use 'es' as lang attribute
    expect(document.documentElement.lang).toBe("es");
  });

  it("handles system locale fallback", () => {
    vi.stubGlobal("navigator", { language: "fr-FR" }); // Not supported
    setLocale({ locale: AppLanguages.SYSTEM });
    expect(document.documentElement.lang).toBe(defaultLocale);
  });

  it("handles missing navigator for system locale", () => {
    // @ts-ignore
    vi.stubGlobal("navigator", undefined);
    setLocale({ locale: AppLanguages.SYSTEM });
    expect(document.documentElement.lang).toBe(defaultLocale);
  });

  it("inits from localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(AppLanguages.PORTUGUESE);
    initLocale();
    expect($currentLocale.get()).toBe(AppLanguages.PORTUGUESE);
  });

  it("inits default to system if no localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    initLocale();
    expect($currentLocale.get()).toBe(AppLanguages.SYSTEM);
  });

  it("returns early in initLocale if localStorage is undefined", () => {
    // @ts-ignore
    vi.stubGlobal("localStorage", undefined);
    initLocale();
    // Should not throw
  });
});
