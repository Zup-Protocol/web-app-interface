import type {
  MultiChainTokenMetadata,
  BlockchainAddress as SDKBlockchainAddress,
  TokenBasket as SDKTokenBasket,
  SingleChainTokenMetadata,
} from "@hydric/gateway";

export type ChainId = number;

export type BlockchainAddress = SDKBlockchainAddress;

export interface SingleChainToken extends SingleChainTokenMetadata {
  type: "single-chain";
}

export interface MultiChainToken extends MultiChainTokenMetadata {
  type: "multi-chain";
}

export interface TokenBasket extends SDKTokenBasket {
  type: "basket";
}

export type SelectableAsset = SingleChainToken | MultiChainToken | TokenBasket;

export type AssetSelectorSide = "A" | "B";
