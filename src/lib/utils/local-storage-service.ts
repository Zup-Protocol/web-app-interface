import { z } from "zod";
import { ISearchSettingsConfig } from "../../core/interfaces/search-settings-config.interface";
import { appLanguagesSchema } from "../../core/schemas/app-languages.schema";
import { searchSettingsSchema } from "../../core/schemas/search-settings.schema";
import { themeModeSchema } from "../../core/schemas/theme-mode.schema";
import { SearchSettingsConfig } from "../../core/search-settings-config";
import { AppLanguages } from "../app-languages";
import { LocalStorageKey } from "../local-storage-key";
import { ThemeMode } from "../theme-mode";

const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const FAILED_LOGO_PREFIX = "zfl:";

export class LocalStorage {
  static getSearchSettings(): ISearchSettingsConfig {
    return this._getItem({
      key: LocalStorageKey.SEARCH_SETTINGS,
      schema: searchSettingsSchema,
      fallback: SearchSettingsConfig.default,
    });
  }

  static setSearchSettings(value: ISearchSettingsConfig): void {
    this._setItem({ key: LocalStorageKey.SEARCH_SETTINGS, value });
  }

  static getLocale(): AppLanguages {
    return this._getItem({
      key: LocalStorageKey.LOCALE,
      schema: appLanguagesSchema,
      fallback: AppLanguages.SYSTEM,
    });
  }

  static setLocale(value: AppLanguages): void {
    this._setItem({ key: LocalStorageKey.LOCALE, value });
  }

  static getTheme(): ThemeMode {
    return this._getItem({
      key: LocalStorageKey.THEME,
      schema: themeModeSchema,
      fallback: ThemeMode.SYSTEM,
    });
  }

  static setTheme(value: ThemeMode): void {
    this._setItem({ key: LocalStorageKey.THEME, value });
  }

  static isLogoFailed(hash: string): boolean {
    const entry = this._getRaw(FAILED_LOGO_PREFIX + hash);
    if (!entry) return false;

    const timestamp = parseInt(entry);
    if (isNaN(timestamp) || Date.now() - timestamp > CACHE_EXPIRY_MS) {
      this.removeRaw(FAILED_LOGO_PREFIX + hash);
      return false;
    }
    return true;
  }

  static markLogoAsFailed(hash: string): void {
    this._setRaw(FAILED_LOGO_PREFIX + hash, Date.now().toString());
  }

  static removeLogoFailed(hash: string): void {
    this.removeRaw(FAILED_LOGO_PREFIX + hash);
  }

  // --- Helper Methods ---
  private static _setItem<T>({ key, value }: { key: LocalStorageKey; value: T }): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  private static _getItem<T>({ key, schema, fallback }: { key: LocalStorageKey; schema: z.ZodType<T>; fallback: T }): T {
    if (typeof window === "undefined") return fallback;

    try {
      const stored = localStorage.getItem(key);

      if (!stored) {
        return fallback;
      }

      const parsed = JSON.parse(stored);
      const validation = schema.safeParse(parsed);

      if (validation.success) {
        return validation.data;
      }

      return fallback;
    } catch {
      return fallback;
    }
  }

  private static _setRaw(key: string, value: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  }

  private static _getRaw(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }

  static removeRaw(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }

  static removeItem(key: LocalStorageKey): void {
    this.removeRaw(key);
  }

  static clear(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
  }
}
