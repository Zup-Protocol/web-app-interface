import { AppTranslationsKeys } from "@/i18n/app-translations-keys";

export const pt: Record<AppTranslationsKeys, string> = {
  [AppTranslationsKeys.HEADER_NAV_POSITIONS]: "Nova Posição",
  [AppTranslationsKeys.HEADER_BUTTONS_CONNECT]: "Conectar Carteira",
  [AppTranslationsKeys.HEADER_BUTTONS_SETTINGS]: "Configuração",
  [AppTranslationsKeys.HEADER_BUTTONS_CONNECTED]: "Conectado",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_TITLE]: "Selecionar Rede",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_DESCRIPTION]:
    'Selecione sua rede preferida. Escolha uma blockchain específica para filtrar dados ou selecione "Todas as redes" para uma visão geral multichain',
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_SEARCH_PLACEHOLDER]:
    "Buscar uma rede",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_TITLE]:
    "Nenhuma rede encontrada",
  [AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_DESCRIPTION]:
    "Não conseguimos encontrar nenhuma rede que corresponda à sua pesquisa. Tente ajustar suas palavras-chave.",
  [AppTranslationsKeys.SETTINGS_THEME_TITLE]: "Modo de Tema",
  [AppTranslationsKeys.SETTINGS_THEME_LIGHT]: "Claro",
  [AppTranslationsKeys.SETTINGS_THEME_DARK]: "Escuro",
  [AppTranslationsKeys.SETTINGS_THEME_SYSTEM]: "Sistema",
  [AppTranslationsKeys.SETTINGS_THEME_PLACEHOLDER]: "Selecionar tema",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_PLACEHOLDER]: "Selecionar idioma",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_TITLE]: "Idioma",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_EN]: "Inglês (English)",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_ES]: "Espanhol (Español)",
  [AppTranslationsKeys.NETWORKS_ALL]: "Todas as Redes",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_PT]: "Português",
  [AppTranslationsKeys.SETTINGS_LANGUAGE_SYSTEM]: "Sistema",

  [AppTranslationsKeys.NEW_POSITION_TITLE]: "Nova Posição",
  [AppTranslationsKeys.NEW_POSITION_DESCRIPTION]:
    "Escolha os tokens que você gostaria de adicionar liquidez. Vamos buscar por pools com esses tokens em todas as exchanges que suportamos.",
  [AppTranslationsKeys.NEW_POSITION_ASSET_A_LABEL]: "Ativo A",
  [AppTranslationsKeys.NEW_POSITION_ASSET_B_LABEL]: "Ativo B",
  [AppTranslationsKeys.NEW_POSITION_BASKET_LABEL]: "Cesta",
  [AppTranslationsKeys.NEW_POSITION_SELECT_ASSET]: "Selecionar Ativo",
  [AppTranslationsKeys.NEW_POSITION_SEARCH_BUTTON]:
    "Me mostre onde está o dinheiro!",
  [AppTranslationsKeys.NEW_POSITION_SEARCH_SETTINGS_BUTTON]:
    "Configurações de Busca",

  [AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TITLE]:
    "Liquidez Mínima da Pool",
  [AppTranslationsKeys.SEARCH_SETTINGS_MIN_LIQUIDITY_TOOLTIP]:
    "Pools com liquidez abaixo desse valor não serão exibidas",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_TITLE]: "Corretoras",
  [AppTranslationsKeys.SEARCH_SETTINGS_LOW_LIQUIDITY_WARNING]:
    "Liquidez mínima baixa pode levar a rendimentos enganosos, tenha cuidado",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SEARCH_PLACEHOLDER]:
    "Buscar corretoras por nome",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_CLEAR_ALL]: "Desativar tudo",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_SELECT_ALL]: "Ativar tudo",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ALL]: "Todos",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_ENABLED]: "Ativas",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_FILTER_DISABLED]: "Inativas",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_DESCRIPTION]:
    "Desative corretoras para ocultá-las dos resultados. Você pode reativá-las quando quiser.",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_TITLE]:
    "Nenhuma corretora encontrada",
  [AppTranslationsKeys.EXCHANGES_FILTER_MODAL_EMPTY_DESCRIPTION]:
    "Não achamos nenhuma corretora com esses critérios. Tente mudar os filtros ou procurar outra coisa.",
  [AppTranslationsKeys.ASSET_SELECTOR_SEARCH_PLACEHOLDER]: "Buscar ativo",
  [AppTranslationsKeys.ASSET_SELECTOR_SEARCH_RESULTS_TITLE]:
    "Resultados da busca",
  [AppTranslationsKeys.ASSET_SELECTOR_EMPTY_TITLE]: "Nenhum ativo encontrado",
  [AppTranslationsKeys.ASSET_SELECTOR_EMPTY_DESCRIPTION]:
    'Não encontramos nenhum resultado para "{query}". Tente pesquisar outra coisa.',
  [AppTranslationsKeys.ASSET_SELECTOR_BASKETS_TITLE]: "Cestas de tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKENS_TITLE]: "Tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_TOKENS]: "{count} tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORK]: "{count} rede",
  [AppTranslationsKeys.ASSET_SELECTOR_BASKET_SUBTITLE_NETWORKS]:
    "{count} redes",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORK]: "{count} rede",
  [AppTranslationsKeys.ASSET_SELECTOR_TOKEN_SUBTITLE_NETWORKS]: "{count} redes",
  [AppTranslationsKeys.ASSET_SELECTOR_ERROR_TITLE]: "Algo deu errado",
  [AppTranslationsKeys.ASSET_SELECTOR_ERROR_DESCRIPTION]:
    "Não conseguimos carregar os ativos. Por favor, tente novamente.",
  [AppTranslationsKeys.ASSET_SELECTOR_ERROR_RETRY]: "Tentar novamente",
  [AppTranslationsKeys.ASSET_SELECTOR_FILTER_ALL]: "Tudo",
  [AppTranslationsKeys.ASSET_SELECTOR_FILTER_TOKENS]: "Tokens",
  [AppTranslationsKeys.ASSET_SELECTOR_FILTER_BASKETS]: "Cestas",
};
