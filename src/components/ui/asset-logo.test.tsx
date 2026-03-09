import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssetLogo } from "./asset-logo";

// framer-motion Proxy mock
vi.mock("framer-motion", () => {
  const el = (tag: string) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef((props: any, ref: any) => React.createElement(tag, { ...props, ref }));
  const motion = new Proxy({} as any, { get: (_t, p: string) => el(p) });
  return { motion, m: motion, AnimatePresence: ({ children }: any) => <>{children}</> };
});

vi.mock("@/lib/utils/local-storage-service", () => ({
  LocalStorage: {
    isLogoFailed: vi.fn().mockReturnValue(false),
    markLogoAsFailed: vi.fn(),
    removeLogoFailed: vi.fn(),
  },
}));

import { LocalStorage } from "@/lib/utils/local-storage-service";

describe("AssetLogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(LocalStorage.isLogoFailed).mockReturnValue(false);
  });

  it("renders fallback letter when no URL provided", () => {
    render(<AssetLogo symbol="ETH" />);
    expect(screen.getByText("E")).toBeInTheDocument();
  });

  it("renders fallback using name initial when no symbol", () => {
    render(<AssetLogo name="Wrapped Bitcoin" />);
    expect(screen.getByText("W")).toBeInTheDocument();
  });

  it("renders '?' when neither name nor symbol provided", () => {
    render(<AssetLogo />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders an img tag when a URL is provided and logo is not cached as failed", () => {
    render(<AssetLogo url="https://example.com/eth.png" symbol="ETH" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("triggers onLoad: clears loading state and removes from failed cache", () => {
    render(<AssetLogo url="https://example.com/eth.png" symbol="ETH" />);
    const img = screen.getByRole("img");
    fireEvent.load(img);
    expect(LocalStorage.removeLogoFailed).toHaveBeenCalled();
  });

  it("triggers onError: sets error state and marks as failed in cache", () => {
    render(<AssetLogo url="https://example.com/eth.png" symbol="ETH" />);
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(LocalStorage.markLogoAsFailed).toHaveBeenCalled();
    // After error, fallback should appear
    expect(screen.getByText("E")).toBeInTheDocument();
  });

  it("initialises as errored when the URL is already cached as failed", () => {
    vi.mocked(LocalStorage.isLogoFailed).mockReturnValue(true);
    render(<AssetLogo url="https://example.com/bad.png" symbol="BAD" />);
    // No img rendered — only fallback letter
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
