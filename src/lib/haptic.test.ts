import { beforeEach, describe, expect, it, vi } from "vitest";
import { triggerHaptic } from "./haptic";

describe("triggerHaptic", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      vibrate: vi.fn(),
    });
  });

  it("calls navigator.vibrate if available", () => {
    triggerHaptic(20);
    expect(navigator.vibrate).toHaveBeenCalledWith(20);
  });

  it("uses default pattern if none provided", () => {
    triggerHaptic();
    expect(navigator.vibrate).toHaveBeenCalledWith(10);
  });

  it("does not throw if vibrate fails", () => {
    vi.mocked(navigator.vibrate).mockImplementation(() => {
      throw new Error("Blocked");
    });
    expect(() => triggerHaptic()).not.toThrow();
  });

  it("does nothing if vibrate is not available", () => {
    vi.stubGlobal("navigator", {});
    expect(() => triggerHaptic()).not.toThrow();
  });
});
