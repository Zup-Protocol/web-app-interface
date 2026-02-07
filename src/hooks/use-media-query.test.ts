import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  let matchMediaMock: any;
  let originalMatchMedia: any;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockImplementation(() => matchMediaMock);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("returns matches from matchMedia", () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("updates when matchMedia changes", () => {
    let callback: any;
    matchMediaMock.addEventListener.mockImplementation(
      (name: string, cb: any) => {
        if (name === "change") callback = cb;
      },
    );

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);

    // Simulate change
    act(() => {
      matchMediaMock.matches = true;
      callback();
    });

    expect(result.current).toBe(true);
  });

  it("uses subscribe and unsubscribe correctly", () => {
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
    unmount();
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
