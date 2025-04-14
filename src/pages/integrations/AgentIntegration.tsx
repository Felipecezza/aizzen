import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { WebhookUrlCard } from "@/components/integrations/agent/WebhookUrlCard";

const AgentIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>();
  const { toast } = useToast();

  const handleConnect = async (name: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const webhookPath = `/agent/${user.id}/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`;
      const fullWebhookUrl = `https://vtcchttcvmaijvjjcxpu.functions.supabase.co/universal-webhook${webhookPath}`;

      const { error } = await supabase
        .from("account_webhooks")
        .insert({
          webhook_url: webhookPath,
          account_id: user.id,
          status: 'pendente',
          integration_type: 'agent' // Adicionar o tipo de integração
        });

      if (error) throw error;

      setWebhookUrl(fullWebhookUrl);
      toast({
        title: "Integração criada com sucesso!",
        description: "Use o URL gerado para configurar o webhook.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar integração",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-6">
          <WebhookUrlCard
            onConnect={handleConnect}
            webhookUrl={webhookUrl}
            isLoading={isLoading}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AgentIntegration;