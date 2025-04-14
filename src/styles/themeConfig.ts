
import { colors } from "./colors";

/**
 * Configuração do tema centralizada
 * Este arquivo exporta constantes que serão usadas no tailwind.config.ts
 * Baseado no design system Horizon.Gen
 */
export const themeColors = {
  // Cores do tema
  primary: {
    ...colors.primary,
  },
  
  // Cores de background
  background: {
    ...colors.background,
    default: "#0a0a0a", // Mantido #0a0a0a
  },
  
  // Tons de zinco
  zinc: colors.zinc,
  
  // Tons escuros
  dark: {
    ...colors.dark,
    DEFAULT: "#0a0a0a", // Mantido #0a0a0a
    700: "#121212", // Mantido #121212 como padrão para componentes
  },
  
  // Estados
  state: colors.state,
  
  // Cores de texto
  text: colors.text,
  
  // Cores de borda
  border: colors.border,
  
  // Cores de gráficos
  chart: colors.chart,
  
  // Cores de status
  status: colors.status
};

export const fontConfig = {
  sans: ['Inter', 'sans-serif'],
};

export const borderRadiusConfig = {
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)',
};

export const backgroundDefaults = {
  component: "#121212", // dark-700
  card: "#121212",      // dark-700
  container: "#121212", // dark-700
};
