
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useState } from "react";

interface WebhookUrlInputProps {
  fullUrl: string;
  webhookId: string;
}

export const WebhookUrlInput = ({ fullUrl, webhookId }: WebhookUrlInputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayUrl = `https://webhook.../${webhookId}`;

  return (
    <div className="relative">
      <Input
        value={displayUrl}
        readOnly
        className="font-mono text-sm pr-24 h-12 py-3 px-4"
      />
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
      >
        <Copy className="h-4 w-4 mr-1" />
        {copied ? "Copiado!" : "Copiar"}
      </Button>
    </div>
  );
};
