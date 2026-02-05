import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("c1", "c2")).toBe("c1 c2");
    });

    it("handles conditional classes", () => {
      expect(cn("c1", true && "c2", false && "c3")).toBe("c1 c2");
    });

    it("handles undefined and null inputs", () => {
      expect(cn("c1", undefined, null)).toBe("c1");
    });

    it("merges tailwind classes using tailwind-merge (overrides)", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("handles array inputs", () => {
      expect(cn(["c1", "c2"])).toBe("c1 c2");
    });

    it("handles object inputs", () => {
      expect(cn({ c1: true, c2: false })).toBe("c1");
    });
  });
});
