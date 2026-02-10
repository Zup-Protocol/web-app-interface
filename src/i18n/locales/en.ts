import { AppTranslationsKeys } from "@/i18n/app-translations-keys";

export const en: Record<AppTranslationsKeys, string> = {
  [AppTranslationsKeys.HEADER_NAV_POSITIONS]: "New Position",
  [AppTranslationsKeys.HEADER_BUTTONS_CONNECT]: "Connect Wallet",
  [AppTranslationsKeys.HEADER_BUTTONS_SETTINGS]: "Settings",
  [AppTranslationsKeys.HEADER_BUTTONS_CONNECTED]: "Connected",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_TITLE]: "Select Network",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_DESCRIPTION]:
    'Select your preferred network. Choose a specific chain to filter data, or select "All Networks" for a multi-chain overview',
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_SEARCH_PLACEHOLDER]:
    "Find a network",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_TITLE]: "No networks found",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_DESCRIPTION]:
    "We couldn't find any network matching your search. Try adjusting your keywords.",
  [AppTranslationsKeys.SETTINGS_THEME_TITLE]: "Theme Mode",
  [AppTranslationsKeys.SETTINGS_THEME_LIGHT]: "Light",
  [AppTranslationsKeys.SETTINGS_THEME_DARK]: "Dark",
  [AppTranslationsKeys.SETTINGS_THEME_SYSTEM]: "System",
  [AppTranslationsKeys.SETTINGS_THEME_PLACEHOLDER]: "Select theme",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_PLACEHOLDER]: "Select language",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_TITLE]: "Language",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_EN]: "English",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_ES]: "Spanish (Español)",
  [AppTranslationsKeys.NETWORKS_ALL]: "All Networks",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_PT]: "Portuguese (Português)",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_SYSTEM]: "System",

  [AppTranslationsKeys.NEW_POSITION_TITLE]: "New Position",
  [AppTranslationsKeys.NEW_POSITION_DESCRIPTION]:
    "Pick the tokens you want to provide liquidity for. We'll hunt down the best pools across every exchange we support.",
  [AppTranslationsKeys.NEW_POSITION_ASSET_A_LABEL]: "Asset A",
  [AppTranslationsKeys.NEW_POSITION_ASSET_B_LABEL]: "Asset B",
  [AppTranslationsKeys.NEW_POSITION_BASKET_LABEL]: "Basket",
  [AppTranslationsKeys.NEW_POSITION_SELECT_ASSET]: "Select Asset",
  [AppTranslationsKeys.NEW_POSITION_SEARCH_BUTTON]: "Show me the money!",
  [AppTranslationsKeys.NEW_POSITION_SEARCH_SETTINGS_BUTTON]: "Search Settings",

  [AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TITLE]:
    "Minimum Pool Liquidity",
  [AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TOOLTIP]:
    "Pools with liquidity below this amount will be excluded from results.",
  [AppTranslationsKeys.SEARCH_SETTINGS_LOW_LIQUIDITY_WARNING]:
    "Low liquidity can make yields look misleading, be careful out there",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_TITLE]: "Exchanges",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SEARCH_PLACEHOLDER]:
    "Search exchanges by name",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_CLEAR_ALL]: "Disable All",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SELECT_ALL]: "Enable All",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ALL]: "All",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ENABLED]: "Enabled",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_DISABLED]: "Disabled",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_DESCRIPTION]:
    "Don't want to see certain exchanges? Just turn them off here. They'll stay hidden until you enable them again.",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_TITLE]:
    "No exchanges found",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_DESCRIPTION]:
    "No exchanges match your filters. Try adjusting your search or checking a different category.",
  [AppTranslationsKeys.ASSET_SELECTOR_SEARCH_PLACEHOLDER]: "Search asset",
  [AppTranslationsKeys.ASSET_SELECTOR_SEARCH_RESULTS_TITLE]: "Search Results",
  [AppTranslationsKeys.ASSET_SELECTOR_EMPTY_TITLE]: "No assets found",
  [AppTranslationsKeys.ASSET_SELECTOR_EMPTY_DESCRIPTION]:
    'We couldn\'t find any results for "{query}". Try searching for something else.',
  [AppTranslationsKeys.ASSET_SELECTOR_BASKETS_TITLE]: "Token baskets",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKENS_TITLE]: "Tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_TOKENS]: "{count} tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORK]:
    "{count} network",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORKS]:
    "{count} networks",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORK]:
    "{count} network",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORKS]:
    "{count} networks",
};
