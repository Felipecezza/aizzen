import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, HelpCircle, XCircle } from "lucide-react";

interface WebhookStatusBadgeProps {
  status: string;
}

export const WebhookStatusBadge = ({ status }: WebhookStatusBadgeProps) => {
  // Normalize status para minúsculas para comparação
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === "active" || normalizedStatus === "ativo") {
    return (
      <Badge className="bg-green-500/20 text-green-400 border border-green-600/40 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        <span>Ativo</span>
      </Badge>
    );
  }
  
  if (normalizedStatus === "pending" || normalizedStatus === "pendente") {
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border border-amber-600/40 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        <span>Pendente</span>
      </Badge>
    );
  }
  
  if (normalizedStatus === "inactive" || normalizedStatus === "inativo") {
    return (
      <Badge className="bg-red-500/20 text-red-400 border border-red-600/40 flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        <span>Inativo</span>
      </Badge>
    );
  }
  
  // Fallback para status desconhecidos
  return (
    <Badge className="bg-zinc-500/20 text-zinc-400 border border-zinc-600/40 flex items-center gap-1">
      <HelpCircle className="w-3 h-3" />
      <span>{status || "Desconhecido"}</span>
    </Badge>
  );
};
