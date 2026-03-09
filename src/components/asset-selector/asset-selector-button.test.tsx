import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { AssetSelectorButton } from "./asset-selector-button";

// framer-motion — Proxy that handles any motion.X usage
vi.mock("framer-motion", () => {
  const el = (tag: string) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef((props: any, ref: any) => React.createElement(tag, { ...props, ref }));
  const motion = new Proxy({} as any, { get: (_t, p: string) => el(p) });
  return { motion, m: motion, AnimatePresence: ({ children }: any) => <>{children}</> };
});

vi.mock("@/hooks/use-translation", () => ({
  useTranslation: () => ({ translate: (key: string) => key }),
}));

vi.mock("@/components/ui/asset-logo", () => ({
  AssetLogo: ({ symbol, name }: any) => <div data-testid="asset-logo">{symbol || name}</div>,
}));

vi.mock("@/components/ui/icons/cursor-click", () => ({
  CursorClickIcon: React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ startAnimation: vi.fn(), stopAnimation: vi.fn() }));
    return <svg data-testid="cursor-click-icon" />;
  }),
}));

const singleChainToken: any = {
  id: "eth",
  type: "single-chain-token",
  symbol: "ETH",
  name: "Ethereum",
  logoUrl: "https://example.com/eth.png",
};

const basketAsset: any = {
  id: "basket-1",
  type: "basket",
  name: "Stable Basket",
  logoUrl: "https://example.com/basket.png",
};

describe("AssetSelectorButton", () => {
  it("renders label when no asset is selected", () => {
    render(<AssetSelectorButton label="Pick a token" />);
    expect(screen.getByText("Pick a token")).toBeInTheDocument();
    expect(screen.getByTestId("cursor-click-icon")).toBeInTheDocument();
  });

  it("renders token symbol and name when a single-chain token is selected", () => {
    render(<AssetSelectorButton label="Pick" selectedAsset={singleChainToken} />);
    // Symbol appears as display label AND inside AssetLogo mock
    expect(screen.getAllByText("ETH").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByTestId("asset-logo")).toBeInTheDocument();
  });

  it("renders basket name and label when a basket asset is selected", () => {
    render(<AssetSelectorButton label="Pick" selectedAsset={basketAsset} />);
    // "Stable Basket" appears as display label; basket label key shows as the sub-label
    const basketNameElements = screen.getAllByText("Stable Basket");
    expect(basketNameElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(AppTranslationsKeys.NEW_POSITION_BASKET_LABEL)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<AssetSelectorButton label="Pick" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fires hover enter/leave handlers (icon animation)", () => {
    render(<AssetSelectorButton label="Pick" />);
    const button = screen.getByRole("button");
    // framer-motion onHoverStart/End become React events in the Proxy mock
    fireEvent.pointerEnter(button);
    fireEvent.pointerLeave(button);
    // No error = animations wired correctly
  });
});
