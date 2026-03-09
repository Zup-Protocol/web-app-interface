import { describe, expect, it } from "vitest";
import { AppLanguages } from "../../lib/app-languages";
import { appLanguagesSchema } from "./app-languages.schema";

describe("app-languages.schema", () => {
  it("should accept valid languages", () => {
    expect(appLanguagesSchema.safeParse(AppLanguages.ENGLISH).success).toBe(true);
    expect(appLanguagesSchema.safeParse(AppLanguages.SYSTEM).success).toBe(true);
  });

  it("should reject invalid languages", () => {
    expect(appLanguagesSchema.safeParse("fr").success).toBe(false);
    expect(appLanguagesSchema.safeParse(null).success).toBe(false);
  });
});
