
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusTailwindClass } from "@/styles/colorSystem";

interface WebhookStatusBadgeProps {
  status: string;
}

export const WebhookStatusBadge = ({ status }: WebhookStatusBadgeProps) => {
  const isActive = status.toLowerCase() === 'active' || status.toLowerCase() === 'ativo';

  return (
    <Badge className={cn(getStatusTailwindClass(status))}>
      {isActive ? (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      ) : (
        <AlertCircle className="w-3 h-3 mr-1" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </Badge>
  );
};
