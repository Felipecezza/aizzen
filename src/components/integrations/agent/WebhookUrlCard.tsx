import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { WebhookList } from "./WebhookList";

interface WebhookUrlCardProps {
  onConnect: (name: string) => void;
  webhookUrl?: string;
  isLoading?: boolean;
}

interface Webhook {
  id: string;
  webhook_url: string;
  status: string;
  created_at: string;
}

export const WebhookUrlCard = ({ onConnect, isLoading }: WebhookUrlCardProps) => {
  const [integrationName, setIntegrationName] = useState("");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(true);
  const { toast } = useToast();

  const fetchWebhooks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("account_webhooks")
        .select("*")
        .eq("account_id", user.id)
        .eq("integration_type", "agent");

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      toast({
        title: "Erro ao carregar webhooks",
        description: "Não foi possível carregar seus webhooks. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();

    const channel = supabase
      .channel('account_webhooks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_webhooks',
          filter: 'integration_type=eq.agent'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setWebhooks(current => [...current, payload.new as Webhook]);
          } else if (payload.eventType === 'UPDATE') {
            setWebhooks(current =>
              current.map(webhook =>
                webhook.id === payload.new.id ? { ...webhook, ...payload.new } : webhook
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setWebhooks(current =>
              current.filter(webhook => webhook.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleConnect = () => {
    if (integrationName.trim()) {
      onConnect(integrationName.trim());
      setIntegrationName("");
    }
  };

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Agente</h2>
        <p className="text-muted-foreground mt-2">
          Conecte seu agente para sincronizar seus atendimentos automaticamente.
        </p>
      </div>

      <Card className="bg-dark-700 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Conectar Novo Agente</CardTitle>
          <CardDescription className="text-gray-400">
            Configure um novo webhook para receber atendimentos do agente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Nome da integração (ex: Agente Principal)"
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
              className="bg-dark-500 border-zinc-700 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={handleConnect}
              disabled={!integrationName.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dark-700 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Agentes Conectados</CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie suas integrações com agentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebhookList
            webhooks={webhooks}
            isLoading={isLoadingWebhooks}
            onDeleteWebhook={handleDeleteWebhook}
          />
        </CardContent>
      </Card>
    </div>
  );
};