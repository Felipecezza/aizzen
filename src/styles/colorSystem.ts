
// Importing color system from our colors file
import { colors } from "./colors";

// Export PALETTE and SEMANTIC from colors for direct imports
export const PALETTE = {
  primary: colors.primary,
  dark: colors.dark,
  zinc: colors.zinc,
  success: colors.state.success,
  warning: colors.state.warning,
  danger: colors.state.danger,
  info: colors.state.info
};

export const SEMANTIC = {
  status: colors.status
};

/**
 * Returns a Tailwind class for status styling
 */
export const getStatusTailwindClass = (status: string | null): string => {
  switch (status?.toLowerCase()) {
    case "agendado":
    case "reagendado":
      return "bg-info-background text-info-DEFAULT";
    case "separado":
    case "em separação":
    case "a reagendar":
    case "pending":
    case "pendente":
    case "connecting":
    case "conectando":
      return "bg-warning-background text-warning-DEFAULT";
    case "entregue":
    case "approved":
    case "aprovado":
    case "active":
    case "ativo":
      return "bg-success-background text-success-DEFAULT";
    case "em trânsito":
      return "bg-purple-500/20 text-purple-400";
    case "cancelado":
    case "frustrado":
    case "rejected":
    case "rejeitado":
      return "bg-danger-background text-danger-DEFAULT";
    case "em rota":
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

/**
 * Returns a color for status
 */
export const getStatusColor = (status: string | null): string => {
  switch (status?.toLowerCase()) {
    case "agendado":
    case "reagendado":
      return colors.status.agendado;
    case "separado":
    case "em separação":
    case "a reagendar":
    case "pending":
    case "pendente":
      return colors.status.separado;
    case "entregue":
    case "approved":
    case "aprovado":
    case "active":
    case "ativo":
      return colors.status.entregue;
    case "em trânsito":
      return colors.status.emTransito;
    case "cancelado":
    case "frustrado":
    case "rejected":
    case "rejeitado":
      return colors.status.cancelado;
    case "em rota":
      return colors.status.emRota;
    case "connecting":
    case "conectando":
      return colors.status.conectando;
    default:
      return "#71717a"; // Default zinc-500
  }
};
