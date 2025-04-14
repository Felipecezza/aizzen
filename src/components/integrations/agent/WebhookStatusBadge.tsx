
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WebhookStatusBadgeProps {
  status: string;
}

export const WebhookStatusBadge = ({ status }: WebhookStatusBadgeProps) => {
  const getStatusClass = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "ativo":
      case "active":
        return "bg-[#4fefa2]/10 text-[#4fefa2] hover:bg-[#4fefa2]/20 border-transparent";
      case "pendente":
      case "pending":
      case "connecting":
      case "conectando":
        return "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-transparent";
      case "inactive":
      case "inativo":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30 border-transparent";  
      default:
        return "bg-muted/10 text-muted-foreground hover:bg-muted/20 border-transparent";
    }
  };

  const getStatusText = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "active":
      case "ativo":
        return "Ativo";
      case "pending":
      case "pendente":
        return "Pendente";
      case "connecting":
      case "conectando":
        return "Conectando";
      case "inactive":
      case "inativo":
        return "Inativo";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'ativo' || normalizedStatus === 'active') {
      return <CheckCircle2 className="w-3 h-3 mr-1 text-[#4fefa2]" />;
    } else if (normalizedStatus === 'pending' || normalizedStatus === 'pendente' || 
               normalizedStatus === 'connecting' || normalizedStatus === 'conectando') {
      return <Clock className="w-3 h-3 mr-1" />;
    } else {
      return <AlertCircle className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <Badge className={cn(getStatusClass(status))}>
      {getStatusIcon(status)}
      {getStatusText(status)}
    </Badge>
  );
};
