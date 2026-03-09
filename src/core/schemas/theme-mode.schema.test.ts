import { describe, expect, it } from "vitest";
import { ThemeMode } from "../../lib/theme-mode";
import { themeModeSchema } from "./theme-mode.schema";

describe("theme-mode.schema", () => {
  it("should accept valid theme modes", () => {
    expect(themeModeSchema.safeParse(ThemeMode.DARK).success).toBe(true);
    expect(themeModeSchema.safeParse(ThemeMode.SYSTEM).success).toBe(true);
  });

  it("should reject invalid theme modes", () => {
    expect(themeModeSchema.safeParse("blue").success).toBe(false);
    expect(themeModeSchema.safeParse(undefined).success).toBe(false);
  });
});
