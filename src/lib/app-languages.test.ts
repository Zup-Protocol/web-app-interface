import { describe, expect, it, vi } from "vitest";
import { AppLanguages, AppLanguagesUtils } from "./app-languages";

describe("AppLanguagesUtils", () => {
  it("contains correct language values", () => {
    expect(AppLanguagesUtils.values).toContain(AppLanguages.ENGLISH);
    expect(AppLanguagesUtils.values).toContain(AppLanguages.SPANISH);
    expect(AppLanguagesUtils.values).toContain(AppLanguages.PORTUGUESE);
    expect(AppLanguagesUtils.values).toContain(AppLanguages.SYSTEM);
  });

  it("maps falgs correctly", () => {
    // Just check existence
    expect(AppLanguagesUtils.flag[AppLanguages.ENGLISH]).toBeDefined();
    expect(AppLanguagesUtils.flag[AppLanguages.SYSTEM]).toBe("");
  });

  it("getLanguageName returns translated name", () => {
    const mockTranslate = vi
      .fn()
      .mockImplementation((key) => `Translated ${key}`);

    const name = AppLanguagesUtils.getLanguageName(
      AppLanguages.ENGLISH,
      mockTranslate,
    );

    expect(mockTranslate).toHaveBeenCalledWith(
      AppLanguagesUtils.nameKey[AppLanguages.ENGLISH],
    );
    expect(name).toBe(
      `Translated ${AppLanguagesUtils.nameKey[AppLanguages.ENGLISH]}`,
    );
  });
});
