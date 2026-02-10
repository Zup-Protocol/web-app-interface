import type {
  MultiChainToken,
  SelectableAsset,
  SingleChainToken,
  TokenBasket,
} from "@/core/types/token.types";

export const POPULAR_TOKENS: (SingleChainToken | MultiChainToken)[] = [
  {
    type: "multi-chain",
    symbol: "LONGTOKENNAME",
    name: "Extremely Long Token Name That Should Definitely Truncate In The UI To Test Our Amazing Smart Truncation Logic",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x0000000000000000000000000000000000000000",
    chainIds: [1, 8453, 143, 130, 999],
    addresses: [
      { chainId: 1, address: "0x0000000000000000000000000000000000000001" },
    ],
  },
  {
    type: "multi-chain",
    symbol: "ETH",
    name: "Ethereum",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x0000000000000000000000000000000000000000",
    chainIds: [1, 8453, 143],
    addresses: [
      { chainId: 1, address: "0x0000000000000000000000000000000000000000" },
      { chainId: 8453, address: "0x0000000000000000000000000000000000000000" },
    ],
  },
  {
    type: "multi-chain",
    symbol: "USDC",
    name: "USD Coin",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    chainIds: [1, 8453],
    addresses: [
      { chainId: 1, address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
      { chainId: 8453, address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
    ],
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "USDT",
    name: "Tether USD",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xdac17f958d2ee523a2206206994597c13d831ec7",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "DAI",
    name: "Dai Stablecoin",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x6b175474e89094c44da98b954eedeac495271d0f",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "LINK",
    name: "Chainlink",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x514910771af9ca656af840dff83e8264ecf986ca",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "UNI",
    name: "Uniswap",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "AAVE",
    name: "Aave",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "SNX",
    name: "Synthetix Network Token",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    address: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "YFI",
    name: "yearn.finance",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
    address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "COMP",
    name: "Compound",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xc00e94cb662c3520282e6f5717214004a7f26888",
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "MKR",
    name: "Maker",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "PEPE",
    name: "PEPE",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x6982508145454ce325ddbe47a25d4ec3d2311933",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "SHIB",
    name: "Shiba Inu",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "LDO",
    name: "Lido DAO",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x5a9878114027551939551c98580f50c689d02c33",
    address: "0x5a9878114027551939551c98580f50c689d02c33",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "ARB",
    name: "Arbitrum",
    logoUrl:
      "https://logos.hydric.org/tokens/42161/0x912ce59144191c1204e64559fe8253a0e49e6548",
    address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 8453,
    symbol: "cbETH",
    name: "Coinbase Wrapped Staked ETH",
    logoUrl:
      "https://logos.hydric.org/tokens/8453/0x2ae3f18709e1d7524781700139095602bc965399",
    address: "0x2ae3f18709e1d7524781700139095602bc965399",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "GRT",
    name: "The Graph",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xc944e90c64b2c07662a292be6244bdf05cda44a7",
    address: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "BAT",
    name: "Basic Attention Token",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "MANA",
    name: "Decentraland",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x0f5d2fb29fb7f3cfee444a200298f468908cc942",
    address: "0x0f5d2fb29fb7f3cfee444a200298f468908cc942",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "SAND",
    name: "The Sandbox",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x3845badade8e6dff049820680d1f14bd3903a5d0",
    address: "0x3845badade8e6dff049820680d1f14bd3903a5d0",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "ENJ",
    name: "Enjin Coin",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
    address: "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "CHZ",
    name: "Chiliz",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x3506424f91fd33084466f402d5d97f05f8e3b4af",
    address: "0x3506424f91fd33084466f402d5d97f05f8e3b4af",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "ZRX",
    name: "0x Project",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0xe41d2489571d322189246dafa5ebde1f4699f498",
    address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "REN",
    name: "REN",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x408e41840cc415ee06400071387b14d5186bc04c",
    address: "0x408e41840cc415ee06400071387b14d5186bc04c",
    decimals: 18,
  },
  {
    type: "single-chain",
    chainId: 1,
    symbol: "RLC",
    name: "iExec RLC",
    logoUrl:
      "https://logos.hydric.org/tokens/1/0x607f4c5bb672230e8672085532f7e901544a7375",
    address: "0x607f4c5bb672230e8672085532f7e901544a7375",
    decimals: 18,
  },
];

export const TOKEN_BASKETS: TokenBasket[] = [
  {
    type: "basket",
    id: "usd-stablecoins",
    name: "USD Stablecoins",
    description:
      "A basket of the most liquid USD stablecoins in the ecosystem.",
    logoUrl:
      "https://cdn.jsdelivr.net/gh/hydric-org/token-baskets/assets/logos/usd-stablecoins.png",
    chainIds: [1, 8453],
    addresses: [
      { chainId: 1, address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
      { chainId: 1, address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
      { chainId: 1, address: "0x6b175474e89094c44da98b954eedeac495271d0f" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000001" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000002" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000003" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000004" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000005" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000006" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000007" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000008" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000009" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000010" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000011" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000012" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000013" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000014" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000015" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000016" },
      { chainId: 1, address: "0x0000000000000000000000000000000000000017" },
    ],
    tokens: [
      {
        chainId: 1,
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
        logoUrl:
          "https://logos.hydric.org/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      {
        chainId: 1,
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        decimals: 6,
        name: "Tether USD",
        symbol: "USDT",
        logoUrl:
          "https://logos.hydric.org/tokens/1/0xdac17f958d2ee523a2206206994597c13d831ec7",
      },
      {
        chainId: 1,
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        decimals: 18,
        name: "DAI",
        symbol: "DAI",
        logoUrl:
          "https://logos.hydric.org/tokens/1/0x6b175474e89094c44da98b954eedeac495271d0f",
      },
      ...Array.from({ length: 17 }).map((_, i) => ({
        chainId: 1 as 1,
        address: `0x00000000000000000000000000000000000000${(i + 1).toString(16).padStart(2, "0")}`,
        decimals: 18,
        name: `Test Token ${i + 1}`,
        symbol: `TEST${i + 1}`,
        logoUrl: "",
      })),
    ],
  },
];

export const MOCK_SEARCH_RESULTS: SelectableAsset[] = [
  ...POPULAR_TOKENS,
  ...TOKEN_BASKETS,
];
