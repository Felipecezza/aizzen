/**
 * Sistema centralizado de cores do projeto
 * Este arquivo serve como fonte única da verdade para todas as cores usadas na aplicação
 * Baseado no design system Horizon.Gen
 */

export const colors = {
  // Cores primárias
  primary: {
    DEFAULT: "#2bdcd2", // Verde turquesa (ações principais, destaques)
    light: "#58e5de", // Verde turquesa mais claro (hover)
    dark: "#22b0a8", // Verde turquesa mais escuro (active)
    50: "#e9f9f8",
    100: "#d2f4f2",
    200: "#a6e9e5",
    300: "#79ded8",
    400: "#4dd3cb",
    500: "#2bdcd2",
    600: "#22b0a8",
    700: "#1a847e",
    800: "#115854",
    900: "#092c2a",
    background: "rgba(43, 220, 210, 0.1)", // Adicionado para uso consistente
  },
  
  // Cores de texto
  text: {
    primary: "#f8f8f8", // Texto principal para destaque
    secondary: "#e2e2e2", // Texto secundário para uso normal
    muted: "#696975", // Texto de menor importância
    accent: "#2bdcd2", // Texto com destaque na cor primária (Horizon)
    inverted: "#121212", // Texto invertido para fundos claros (atualizado para #121212)
    danger: "#FF6A6A", // Texto para mensagens de erro (Horizon)
    warning: "#FFC555", // Texto para avisos (Horizon)
    success: "#2bdcd2", // Texto para mensagens de sucesso (Horizon)
  },
  
  // Cores de background e elementos de interface
  background: {
    default: "#121212", // Background principal (mais escuro)
    dark: "#0f0f0f", // Background mais escuro
    darker: "#090909", // Background ainda mais escuro
    card: "#1E1E24", // Background de cards e elementos
    cardDark: "#27272a", // Background mais escuro para cards
    input: "#222222", // Background de inputs
    sidebar: "#0f0f0f", // Background da barra lateral
    tooltip: "#333333", // Background para tooltips
    dropdown: "#222222", // Background para dropdowns
    modal: "#18181b", // Background para modais
  },
  
  // Tons de cinza (zinc)
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
  
  // Tons escuros personalizados
  dark: {
    100: "#333333",
    200: "#2d2d2d",
    300: "#272727",
    400: "#222222",
    500: "#1c1c1c",
    600: "#171717",
    700: "#121212", // Base page background
    800: "#0c0c0c",
    900: "#070707", // Sidebar background
    DEFAULT: "#121212",
  },
  
  // Cores de estado
  state: {
    success: {
      DEFAULT: "#2bdcd2", // Verde turquesa (Horizon)
      light: "#58e5de",
      dark: "#22b0a8",
      background: "rgba(43, 220, 210, 0.1)",
    },
    warning: {
      DEFAULT: "#FFC555", // Amarelo (Horizon)
      light: "#FFD177",
      dark: "#FFB933",
      background: "rgba(255, 197, 85, 0.1)",
    },
    danger: {
      DEFAULT: "#FF6A6A", // Vermelho (Horizon)
      light: "#FF8A8A",
      dark: "#FF4A4A",
      background: "rgba(255, 106, 106, 0.1)",
    },
    info: {
      DEFAULT: "#4DABFF", // Azul (Horizon)
      light: "#70BDFF",
      dark: "#2A99FF",
      background: "rgba(77, 171, 255, 0.1)",
    },
    pending: {
      DEFAULT: "#FFC555", // Amarelo (Horizon)
      light: "#FFD177",
      dark: "#FFB933",
      background: "rgba(255, 197, 85, 0.1)",
    },
    approved: {
      DEFAULT: "#2bdcd2", // Verde turquesa (Horizon)
      light: "#58e5de",
      dark: "#22b0a8",
      background: "rgba(43, 220, 210, 0.1)",
    },
    rejected: {
      DEFAULT: "#FF6A6A", // Vermelho (Horizon)
      light: "#FF8A8A",
      dark: "#FF4A4A",
      background: "rgba(255, 106, 106, 0.1)",
    },
    connecting: {
      DEFAULT: "#FFC555", // Amarelo (Horizon) - Mesmo do warning
      light: "#FFD177",
      dark: "#FFB933",
      background: "rgba(255, 197, 85, 0.1)",
    },
  },
  
  // Cores de borda
  border: {
    DEFAULT: "#27272a", // Cor padrão de bordas
    light: "#3f3f46", // Bordas mais claras
    dark: "#18181b", // Bordas mais escuras
    focus: "#2bdcd2", // Bordas para elementos em foco (Horizon)
  },
  
  // Cores de gráficos
  chart: {
    primary: "#01bb9e", // Verde turquesa (Horizon)
    secondary: "#4DABFF", // Azul (Horizon)
    tertiary: "#FFC555", // Amarelo (Horizon)
    quaternary: "#FF6A6A", // Vermelho (Horizon)
    background: "rgba(1, 187, 158, 0.1)", // Fundo para gráficos
  },
  
  // Cores de status específicos para pedidos/fluxos
  status: {
    agendado: "#4DABFF",
    reagendado: "#70BDFF",
    separado: "#FFC555",
    emSeparacao: "#FFD177",
    aReagendar: "#FFC555",
    entregue: "#2bdcd2",
    emTransito: "#9333ea",
    cancelado: "#FF6A6A",
    frustrado: "#FF4A4A",
    emRota: "#f97316",
    pendente: "#FFC555",
    conectando: "#FFC555", // Amarelo para status "conectando"
    ativo: "#2bdcd2",
    pending: "#FFC555",   // Amarelo para status "pending"
    connecting: "#FFC555", // Amarelo para status "connecting"
    active: "#2bdcd2",     // Verde turquesa para status "active"
  }
};

/**
 * Função para obter uma cor com base em um caminho de objeto
 * Exemplo: getColor("primary.light") retorna colors.primary.light
 */
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let result: any = colors;
  
  for (const key of keys) {
    if (result[key] === undefined) {
      console.warn(`Cor não encontrada: ${path}`);
      return "#ffffff";
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Mapeamento de cores de status para classes tailwind
 */
export const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "agendado":
    case "reagendado":
      return "bg-info-background text-info-DEFAULT";
    case "separado":
    case "em separação":
    case "a reagendar":
      return "bg-warning-background text-warning-DEFAULT";
    case "entregue":
      return "bg-success-background text-success-DEFAULT";
    case "em trânsito":
      return "bg-purple-500/20 text-purple-400";
    case "cancelado":
    case "frustrado":
      return "bg-danger-background text-danger-DEFAULT";
    case "em rota":
      return "bg-orange-500/20 text-orange-400";
    case "pending":
    case "pendente":
      return "bg-warning-background text-warning-DEFAULT";
    case "approved":
    case "aprovado":
      return "bg-success-background text-success-DEFAULT";
    case "rejected":
    case "rejeitado":
      return "bg-danger-background text-danger-DEFAULT";
    case "active":
    case "ativo":
      return "bg-success-background text-success-DEFAULT";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

/**
 * Gera uma cor de fundo com opacidade para estados
 */
export const getStateBackgroundColor = (state: keyof typeof colors.state) => {
  if (!colors.state[state]) return colors.state.info.background;
  return colors.state[state].background;
};

/**
 * Obtém a cor do texto para um determinado estado
 */
export const getStateTextColor = (state: keyof typeof colors.state) => {
  if (!colors.state[state]) return colors.state.info.DEFAULT;
  return colors.state[state].DEFAULT;
};
