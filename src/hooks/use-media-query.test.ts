import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockImplementation(() => matchMediaMock);
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

  it("unsubscribes on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    unmount();
    expect(matchMediaMock.removeEventListener).toHaveBeenCalled();
  });
});
