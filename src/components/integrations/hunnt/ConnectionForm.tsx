
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ConnectionFormProps {
  onConnect: (config: {
    api_url: string;
    access_token: string;
    account_id: string;
  }) => void;
  isLoading: boolean;
}

export const ConnectionForm = ({ onConnect, isLoading }: ConnectionFormProps) => {
  const [config, setConfig] = useState({
    api_url: "",
    access_token: "",
    account_id: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(config);
  };

  return (
    <Card className="bg-dark-700 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Conectar Nova Conta</CardTitle>
        <CardDescription className="text-zinc-400">
          Configure uma nova conexão para integrar com o Hunnt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api_url">URL da API do Hunnt</Label>
            <Input
              id="api_url"
              placeholder="https://app.hunnt.com.br"
              value={config.api_url}
              onChange={(e) =>
                setConfig({ ...config, api_url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access_token">Token de Acesso</Label>
            <Input
              id="access_token"
              type="password"
              placeholder="Seu token de acesso do Hunnt"
              value={config.access_token}
              onChange={(e) =>
                setConfig({ ...config, access_token: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_id">ID da Conta</Label>
            <Input
              id="account_id"
              placeholder="ID da sua conta no Hunnt"
              value={config.account_id}
              onChange={(e) =>
                setConfig({ ...config, account_id: e.target.value })
              }
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0ef0b7] hover:bg-[#0ef0b7]/90 text-zinc-900"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              "Conectar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
