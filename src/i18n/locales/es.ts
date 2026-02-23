import { AppTranslationsKeys } from "@/i18n/app-translations-keys";

export const es: Record<AppTranslationsKeys, string> = {
  [AppTranslationsKeys.HEADER_NAV_POSITIONS]: "Nueva Posición",
  [AppTranslationsKeys.HEADER_BUTTONS_CONNECT]: "Conectar Billetera",
  [AppTranslationsKeys.HEADER_BUTTONS_SETTINGS]: "Configuración",
  [AppTranslationsKeys.HEADER_BUTTONS_CONNECTED]: "Conectado",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_TITLE]: "Seleccionar Red",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_DESCRIPTION]:
    'Selecciona tu red preferida. Elige una blockchain específica para filtrar datos o selecciona "Todas las redes" para una descripción general multichain',
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_SEARCH_PLACEHOLDER]:
    "Buscar una red",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_TITLE]:
    "No se encontraron redes",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_DESCRIPTION]:
    "No pudimos encontrar ninguna red que coincida con tu búsqueda. Intenta ajustar tus palabras clave.",
  [AppTranslationsKeys.SETTINGS_THEME_TITLE]: "Modo de Tema",
  [AppTranslationsKeys.SETTINGS_THEME_LIGHT]: "Claro",
  [AppTranslationsKeys.SETTINGS_THEME_DARK]: "Oscuro",
  [AppTranslationsKeys.SETTINGS_THEME_SYSTEM]: "Sistema",
  [AppTranslationsKeys.SETTINGS_THEME_PLACEHOLDER]: "Seleccionar tema",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_PLACEHOLDER]: "Seleccionar idioma",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_TITLE]: "Idioma",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_EN]: "Inglés (English)",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_ES]: "Español",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_PT]: "Portugués (Português)",
  [AppTranslationsKeys.NETWORKS_ALL]: "Todas las Redes",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_SYSTEM]: "Sistema",

  [AppTranslationsKeys.NEW_POSITION_TITLE]: "Nueva Posición",
  [AppTranslationsKeys.NEW_POSITION_DESCRIPTION]:
    "Selecciona los tokens para aportar liquidez. Nosotros nos encargamos de buscar pools en todos los exchanges que soportamos",
  [AppTranslationsKeys.NEW_POSITION_ASSET_A_LABEL]: "Activo A",
  [AppTranslationsKeys.NEW_POSITION_ASSET_B_LABEL]: "Activo B",
  [AppTranslationsKeys.NEW_POSITION_BASKET_LABEL]: "Canasta",
  [AppTranslationsKeys.NEW_POSITION_SELECT_ASSET]: "Seleccionar Activo",
  [AppTranslationsKeys.NEW_POSITION_SEARCH_BUTTON]: "¡Muéstrame el dinero!",
  [AppTranslationsKeys.NEW_POSITION_SEARCH_SETTINGS_BUTTON]:
    "Configuración de Búsqueda",

  [AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TITLE]:
    "Liquidez Mínima del Pool",
  [AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TOOLTIP]:
    "Ocultaremos los pools con liquidez inferior a esta cantidad.",
  [AppTranslationsKeys.SEARCH_SETTINGS_LOW_LIQUIDITY_WARNING]:
    "Un mínimo de liquidez bajo puede mostrar rendimientos engañosos. Ten cuidado",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_TITLE]: "Exchanges",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SEARCH_PLACEHOLDER]:
    "Buscar exchanges por nombre",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_CLEAR_ALL]: "Desactivar todo",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SELECT_ALL]: "Activar todo",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ALL]: "Todos",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ENABLED]: "Activos",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_DISABLED]: "Inactivos",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_DESCRIPTION]:
    "Desactiva los exchanges que quieras ocultar de tu búsqueda. ¡Puedes volver a activarlos cuando quieras!",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_TITLE]:
    "No se encontraron exchanges",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_DESCRIPTION]:
    "Sin resultados para esta búsqueda. Intenta ajustando los filtros o probando algo distinto",
  [AppTranslationsKeys.ASSET_SELECTOR_SEARCH_PLACEHOLDER]: "Buscar activo",
  [AppTranslationsKeys.ASSET_SELECTOR_SEARCH_RESULTS_TITLE]:
    "Resultados de búsqueda",
  [AppTranslationsKeys.ASSET_SELECTOR_EMPTY_TITLE]: "No se encontraron activos",
  [AppTranslationsKeys.ASSET_SELECTOR_EMPTY_DESCRIPTION]:
    'No pudimos encontrar ningún resultado para "{query}". Intenta buscando otra cosa.',
  [AppTranslationsKeys.ASSET_SELECTOR_BASKETS_TITLE]: "Canastas de tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKENS_TITLE]: "Tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_TOKENS]: "{count} tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORK]: "{count} red",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORKS]:
    "{count} redes",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORK]: "{count} red",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORKS]: "{count} redes",
  [AppTranslationsKeys.ASSET_SELECTOR_ERROR_TITLE]: "Algo salió mal",
  [AppTranslationsKeys.ASSET_SELECTOR_ERROR_DESCRIPTION]:
    "No pudimos cargar los activos. Por favor, inténtalo de nuevo.",
  [AppTranslationsKeys.ASSET_SELECTOR_ERROR_RETRY]: "Intentar de nuevo",
};
