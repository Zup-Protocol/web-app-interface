import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchSettingsConfig } from "../../core/search-settings-config";
import { AppLanguages } from "../app-languages";
import { LocalStorageKey } from "../local-storage-key";
import { ThemeMode } from "../theme-mode";
import { LocalStorage } from "./local-storage-service";

describe("LocalStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    vi.stubGlobal("window", {});
  });

  describe("getSearchSettings", () => {
    it("should return default value when localStorage is empty", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      const settings = LocalStorage.getSearchSettings();
      expect(settings).toEqual(SearchSettingsConfig.default);
    });

    it("should return parsed settings when localStorage has valid data", () => {
      const validSettings = { minLiquidity: "5000", blockedExchanges: ["uniswap-v3"] };
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(validSettings));
      const settings = LocalStorage.getSearchSettings();
      expect(settings).toEqual(validSettings);
    });

    it("should return default when JSON is invalid", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("invalid-json");
      const settings = LocalStorage.getSearchSettings();
      expect(settings).toEqual(SearchSettingsConfig.default);
    });

    it("should return default when schema validation fails", () => {
      const invalidSettings = { minLiquidity: 5000 }; // Should be string
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(invalidSettings));
      const settings = LocalStorage.getSearchSettings();
      expect(settings).toEqual(SearchSettingsConfig.default);
    });

    it("should handle corrupted JSON in storage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("invalid-json{");
      expect(LocalStorage.getLocale()).toBe(AppLanguages.SYSTEM);
      expect(LocalStorage.getTheme()).toBe(ThemeMode.SYSTEM);
    });
  });

  describe("setSearchSettings", () => {
    it("should persist settings to localStorage", () => {
      const settings = { minLiquidity: "2000", blockedExchanges: [] };
      LocalStorage.setSearchSettings(settings);
      expect(localStorage.setItem).toHaveBeenCalledWith(LocalStorageKey.SEARCH_SETTINGS, JSON.stringify(settings));
    });
  });

  describe("getLocale / setLocale", () => {
    it("should handle locale persistence", () => {
      LocalStorage.setLocale(AppLanguages.PORTUGUESE);
      expect(localStorage.setItem).toHaveBeenCalledWith(LocalStorageKey.LOCALE, JSON.stringify(AppLanguages.PORTUGUESE));

      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(AppLanguages.PORTUGUESE));
      expect(LocalStorage.getLocale()).toBe(AppLanguages.PORTUGUESE);
    });

    it("should return default locale when invalid", () => {
      vi.mocked(localStorage.getItem).mockReturnValue('"unknown"');
      expect(LocalStorage.getLocale()).toBe(AppLanguages.SYSTEM);
    });
  });

  describe("getTheme / setTheme", () => {
    it("should handle theme persistence", () => {
      LocalStorage.setTheme(ThemeMode.DARK);
      expect(localStorage.setItem).toHaveBeenCalledWith(LocalStorageKey.THEME, JSON.stringify(ThemeMode.DARK));

      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(ThemeMode.DARK));
      expect(LocalStorage.getTheme()).toBe(ThemeMode.DARK);
    });

    it("should return default theme when invalid", () => {
      vi.mocked(localStorage.getItem).mockReturnValue('"invalid-theme"');
      expect(LocalStorage.getTheme()).toBe(ThemeMode.SYSTEM);
    });
  });

  describe("Logo failure caching", () => {
    const hash = "test-hash";
    const key = `zfl:${hash}`;

    it("should return false when no cache exists", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(LocalStorage.isLogoFailed(hash)).toBe(false);
    });

    it("should return true for recent failure", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(Date.now().toString());
      expect(LocalStorage.isLogoFailed(hash)).toBe(true);
    });

    it("should return false and cleanup when expired", () => {
      const oldTime = Date.now() - 8 * 24 * 60 * 60 * 1000; // 8 days ago
      vi.mocked(localStorage.getItem).mockReturnValue(oldTime.toString());
      expect(LocalStorage.isLogoFailed(hash)).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it("should return false for invalid timestamp", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("not-a-number");
      expect(LocalStorage.isLogoFailed(hash)).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it("should mark logo as failed", () => {
      LocalStorage.markLogoAsFailed(hash);
      expect(localStorage.setItem).toHaveBeenCalledWith(key, expect.any(String));
    });

    it("should remove logo failed entry", () => {
      LocalStorage.removeLogoFailed(hash);
      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe("Helper methods", () => {
    it("should handle generic item removal", () => {
      LocalStorage.removeItem(LocalStorageKey.LOCALE);
      expect(localStorage.removeItem).toHaveBeenCalledWith(LocalStorageKey.LOCALE);
    });

    it("should handle clearing all storage", () => {
      LocalStorage.clear();
      expect(localStorage.clear).toHaveBeenCalled();
    });

    it("should handle window undefined (SSR)", () => {
      // @ts-ignore - testing SSR environment
      vi.stubGlobal("window", undefined);
      LocalStorage.setTheme(ThemeMode.LIGHT);
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(LocalStorage.getTheme()).toBe(ThemeMode.SYSTEM);
    });
  });
});
