import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { extractDisplayName } from "@/utils/instanceNameUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw, CheckCircle2 } from "lucide-react";
import { WebhookStatusBadge } from "@/components/integrations/webhook/WebhookStatusBadge";
import { DeleteWhatsappButton } from "./DeleteWhatsappButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface WhatsappConnection {
  id: string;
  instance_name: string;
  status: string;
  created_at: string;
}

interface WhatsappConnectionsListProps {
  onDeleteConnection?: (id: string) => void;
  onRegenerateQRCode?: (instanceName: string) => void;
  triggerRefresh?: number; // New prop to trigger refresh from parent
}

export const WhatsappConnectionsList = ({
  onDeleteConnection,
  onRegenerateQRCode,
  triggerRefresh = 0 // Default to 0
}: WhatsappConnectionsListProps) => {
  const [connections, setConnections] = useState<WhatsappConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkingConnection, setCheckingConnection] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data,
        error
      } = await supabase.from("whatsapp_connections").select("*").eq("user_id", user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      console.log("Conexões recuperadas:", data);

      // Filter out empty instance names with pending status
      const filteredConnections = data?.filter(connection => connection.instance_name && connection.instance_name.trim() !== "") || [];
      setConnections(filteredConnections);
    } catch (error) {
      console.error("Erro ao buscar conexões:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();

    // Set up real-time subscription for whatsapp connections changes
    const channel = supabase.channel('whatsapp_connections_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'whatsapp_connections'
    }, payload => {
      console.log("Mudança detectada na tabela whatsapp_connections:", payload);
      fetchConnections();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (triggerRefresh > 0) {
      fetchConnections();
    }
  }, [triggerRefresh]);

  const checkConnectionStatus = async (instanceName: string) => {
    try {
      setCheckingConnection(instanceName);
      console.log("Verificando status da conexão para:", instanceName);
      const response = await fetch('https://webhook.aizzen.com.br/webhook/verifica-conexao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: instanceName
        })
      });
      if (!response.ok) {
        throw new Error('Falha ao verificar status da conexão');
      }
      const data = await response.json();
      console.log("Resposta da verificação de status:", data);

      // Check if connection is already active
      if (Array.isArray(data) && data[0]?.instance?.state === "open") {
        toast.success("Conexão já está ativa", {
          description: "Esta instância já está conectada."
        });

        // Update status in the database if it's not already updated
        const {
          error: updateError
        } = await supabase.from("whatsapp_connections").update({
          status: "active",
          updated_at: new Date().toISOString()
        }).eq("instance_name", instanceName);
        if (updateError) {
          console.error("Erro ao atualizar status da conexão:", updateError);
        }

        // Refresh the connections list
        fetchConnections();
        return true; // Already connected
      } else {
        // If not connected, check if it's an inactive instance
        if (Array.isArray(data) && data.length === 0) {
          // Update status to inactive in the database
          const {
            error: updateError
          } = await supabase.from("whatsapp_connections").update({
            status: "inactive",
            updated_at: new Date().toISOString()
          }).eq("instance_name", instanceName);
          if (updateError) {
            console.error("Erro ao atualizar status da conexão para inativo:", updateError);
          }

          // Refresh the connections list
          fetchConnections();
          return false;
        }
      }
      return false; // Not connected yet
    } catch (error) {
      console.error("Erro ao verificar status da conexão:", error);
      return false;
    } finally {
      setCheckingConnection(null);
    }
  };

  const handleRegenerateQRCode = async (e: React.MouseEvent, connection: WhatsappConnection) => {
    e.stopPropagation(); // Prevent triggering the parent click handler

    // Only check status when explicitly regenerating QR code via button
    const isConnected = await checkConnectionStatus(connection.instance_name);
    if (!isConnected) {
      // Only regenerate QR code if not already connected
      if (onRegenerateQRCode) {
        onRegenerateQRCode(connection.instance_name);
      } else {
        toast.info("Função não disponível", {
          description: "A função de regeneração de QR Code não está disponível nesta tela."
        });
      }
    }
  };

  const handleDeleteConnection = (connectionId: string) => {
    // Update local state by removing the deleted connection
    setConnections(prevConnections => prevConnections.filter(connection => connection.id !== connectionId));

    // Call parent callback if provided
    if (onDeleteConnection) {
      onDeleteConnection(connectionId);
    }
  };

  if (isLoading) {
    return <div className="space-y-4">
        {[1, 2].map(i => <div key={i} className="p-4 rounded-lg bg-dark-700 border border-zinc-800">
            <Skeleton className="h-6 w-48 bg-zinc-700 mb-2" />
            <Skeleton className="h-4 w-32 bg-zinc-700" />
          </div>)}
      </div>;
  }

  return <div className="space-y-4">
      {connections.length === 0 ? <Alert variant="default" className="bg-dark-700 border-zinc-800 text-zinc-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-white">Nenhuma conexão encontrada</AlertTitle>
          <AlertDescription>
            Você ainda não possui nenhuma conexão ativa. Crie uma nova conexão usando o formulário acima.
          </AlertDescription>
        </Alert> : <div className="space-y-4">
          {connections.map(connection => {
        const isActive = connection.status.toLowerCase() === 'active' || connection.status.toLowerCase() === 'ativo';
        return <div key={connection.id} className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-dark-700">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-white font-medium">
                      {extractDisplayName(connection.instance_name)}
                    </p>
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                      Status: <WebhookStatusBadge status={connection.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isActive && <Button variant="outline" size="icon" className="bg-dark-700 text-zinc-400 hover:bg-zinc-800 hover:text-white h-14 w-14 flex items-center justify-center aspect-square" onClick={e => handleRegenerateQRCode(e, connection)} title="Atualizar QR Code" disabled={checkingConnection === connection.instance_name}>
                      {checkingConnection === connection.instance_name ? <RefreshCcw className="w-8 h-8 animate-spin" /> : <RefreshCcw className="w-8 h-8" />}
                    </Button>}
                  <DeleteWhatsappButton connectionId={connection.id} onDelete={handleDeleteConnection} />
                </div>
              </div>;
      })}
        </div>}
    </div>;
};
