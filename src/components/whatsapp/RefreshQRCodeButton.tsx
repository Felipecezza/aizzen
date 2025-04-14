import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface RefreshQRCodeButtonProps {
  instance: string;
  className?: string;
}

export const RefreshQRCodeButton = ({ instance, className = "" }: RefreshQRCodeButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // Primeiro, busca a conexão para obter o instance_name completo
      const { data: connection, error: fetchError } = await supabase
        .from("whatsapp_connections")
        .select("instance_name")
        .eq("name", instance)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar dados da conexão:", fetchError);
        throw new Error("Erro ao buscar dados da conexão");
      }

      if (!connection?.instance_name) {
        throw new Error("Nome da instância não encontrado");
      }

      const webhookResponse = await fetch("https://webhook.aizzen.com.br/webhook/refresh-qrcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName: connection.instance_name,
        }),
      });

      if (!webhookResponse.ok) {
        const responseText = await webhookResponse.text();
        console.error("Erro ao atualizar QR Code:", responseText);
        throw new Error("Erro ao atualizar QR Code: " + responseText);
      }

      toast.success("QR Code atualizado com sucesso. Atualize a página para visualizar.");
    } catch (error: any) {
      console.error("Erro ao atualizar QR Code:", error);
      toast.error(error.message || "Erro ao atualizar QR Code. Tente novamente.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleRefresh} 
      disabled={isRefreshing}
      className={`bg-zinc-900 border-zinc-800 h-9 w-9 p-0 flex items-center justify-center ${className}`}
    >
      {isRefreshing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <RefreshCw className="h-5 w-5" />
      )}
    </Button>
  );
}; 