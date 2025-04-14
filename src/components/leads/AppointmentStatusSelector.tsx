import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Pause, Play } from "lucide-react";
import { updateAppointmentStatus } from "@/utils/orderHelpers";

interface AppointmentStatusSelectorProps {
  leadId: string;
  currentStatus: string | null;
  productTable: string;
  userId: string;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "Pendente", label: "Pendente", color: "bg-yellow-500" },
  { value: "Agendado", label: "Agendado", color: "bg-blue-500" },
  { value: "Remarcado", label: "Remarcado", color: "bg-purple-500" },
  { value: "Cancelado", label: "Cancelado", color: "bg-red-500" },
  { value: "Concluído", label: "Concluído", color: "bg-green-500" },
  { value: "Silenciado", label: "Silenciado", color: "bg-gray-500" }
];

const AppointmentStatusSelector = ({ 
  leadId, 
  currentStatus, 
  productTable,
  userId, 
  onSuccess 
}: AppointmentStatusSelectorProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "Pendente");
  
  const updateStatus = async (status: string) => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      // Usando a função utilitária que também incrementa vendas quando necessário
      const result = await updateAppointmentStatus(
        leadId,
        status,
        productTable,
        userId
      );
      
      if (!result.success) throw new Error("Falha ao atualizar status");
      
      toast.success(`Status atualizado para: ${status}`);
      
      // Se a venda foi registrada, mostrar mensagem adicional
      if (result.saleRegistered) {
        toast.success("Venda registrada com sucesso!");
      }
      
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Se o status for "Silenciado", desabilitar o seletor
  if (currentStatus === "Silenciado") {
    return (
      <div className="flex items-center">
        <div className="text-sm text-gray-500 italic">Status silenciado</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedStatus}
        onValueChange={(value) => {
          setSelectedStatus(value);
          updateStatus(value);
        }}
        disabled={isUpdating}
      >
        <SelectTrigger 
          className="w-[150px] border-zinc-700 bg-dark-800 focus:ring-0 focus:ring-offset-0 focus:border-primary/70"
        >
          <SelectValue placeholder="Selecionar status" />
        </SelectTrigger>
        <SelectContent className="bg-dark-700 border-zinc-700">
          {statusOptions.filter(option => option.value !== "Silenciado").map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="focus:bg-zinc-800"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isUpdating && (
        <Clock className="h-4 w-4 animate-spin text-primary" />
      )}
    </div>
  );
};

export default AppointmentStatusSelector; 