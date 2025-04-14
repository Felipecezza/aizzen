import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 as LoaderIcon, AlertCircle } from "lucide-react";
import { WebhookUrlInput } from "./WebhookUrlInput";
import { WebhookStatusBadge } from "./WebhookStatusBadge";
import { DeleteWebhookButton } from "./DeleteWebhookButton";

interface Webhook {
  id: string;
  webhook_url: string;
  status: string;
  created_at: string;
}

interface WebhookListProps {
  webhooks: Webhook[];
  isLoading: boolean;
  onDeleteWebhook: (webhookId: string) => void;
}

export const WebhookList = ({ webhooks, isLoading, onDeleteWebhook }: WebhookListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoaderIcon className="h-8 w-8 animate-spin text-[#0ef0b7]" />
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <Alert className="bg-zinc-800 border-zinc-700">
        <AlertCircle className="h-4 w-4 text-zinc-400" />
        <AlertTitle className="text-white">Nenhum agente conectado</AlertTitle>
        <AlertDescription className="text-zinc-400">
          Conecte seu primeiro agente usando o formulário acima.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => {
        const fullWebhookUrl = `https://vtcchttcvmaijvjjcxpu.functions.supabase.co/chatwoot-webhook${webhook.webhook_url}`;
        const webhookId = webhook.webhook_url.split('/').pop()?.replace('/body', '') || '';
        
        return (
          <Card key={webhook.id} className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <WebhookStatusBadge status={webhook.status} />
                  <span className="text-sm text-zinc-400">
                    {new Date(webhook.created_at).toLocaleDateString()}
                  </span>
                </div>
                <DeleteWebhookButton 
                  webhookId={webhook.id} 
                  onDelete={onDeleteWebhook}
                />
              </div>
              <WebhookUrlInput fullUrl={fullWebhookUrl} webhookId={webhookId} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};