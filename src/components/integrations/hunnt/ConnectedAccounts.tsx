
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DeleteAccountButton } from "./DeleteAccountButton";

export const ConnectedAccounts = () => {
  const { data: configs, isLoading, error, refetch } = useQuery({
    queryKey: ["hunnt-configs"],
    queryFn: async () => {
      console.log("Fetching configs...");
      const { data, error } = await supabase
        .from("chatwoot_configs")
        .select("*");

      if (error) {
        console.error("Error fetching configs:", error);
        throw error;
      }

      console.log("Fetched configs:", data);
      return data;
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as contas conectadas. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-dark-700 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Contas Conectadas</CardTitle>
        <CardDescription className="text-zinc-400">
          Gerencie suas integrações com o Hunnt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#0ef0b7]" />
          </div>
        ) : configs && configs.length > 0 ? (
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#0ef0b7]/10 text-[#0ef0b7] px-2 py-1 rounded-md text-sm">
                        ativo
                      </div>
                      <span className="text-sm text-zinc-400">
                        {new Date(config.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <DeleteAccountButton 
                      configId={config.id} 
                      onSuccess={() => {
                        console.log("Deletion successful, refetching...");
                        refetch();
                      }}
                    />
                  </div>
                  <div className="text-sm text-white truncate">
                    {config.api_url}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert className="bg-zinc-800 border-zinc-700">
            <AlertCircle className="h-4 w-4 text-zinc-400" />
            <AlertTitle className="text-white">Nenhuma conta conectada</AlertTitle>
            <AlertDescription className="text-zinc-400">
              Conecte sua primeira conta Hunnt usando o formulário acima.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
