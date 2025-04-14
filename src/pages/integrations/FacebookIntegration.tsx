import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { FacebookAdAccount } from "@/integrations/facebook/types";
import { FacebookAuthButton } from "@/integrations/facebook/components/FacebookAuthButton";
import { toast } from "sonner";

const FacebookIntegration = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: accounts, isLoading, refetch } = useQuery({
    queryKey: ["facebook-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facebook_ad_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FacebookAdAccount[];
    },
  });

  const handleToggleAccount = async (account: FacebookAdAccount, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from("facebook_ad_accounts")
        .update({ status: enabled ? "active" : "disabled" })
        .eq("id", account.id);

      if (error) throw error;

      toast.success(`Conta ${enabled ? "ativada" : "desativada"} com sucesso`);
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar status da conta");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Facebook Ads</h2>
          <p className="text-zinc-400 mt-2">
            Conecte suas contas do Facebook Ads para sincronizar seus dados automaticamente.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Conectar Nova Conta</CardTitle>
            <CardDescription className="text-zinc-400">
              Conecte sua conta do Facebook Ads para começar a sincronização dos dados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacebookAuthButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-white">Contas de Anúncio (Meta)</CardTitle>
              <CardDescription className="text-zinc-400">
                Escolha suas contas de anúncio:
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-400">Ativar todas:</span>
              <Switch 
                checked={accounts?.every(acc => acc.status === "active")}
                onCheckedChange={(checked) => {
                  accounts?.forEach(acc => handleToggleAccount(acc, checked));
                }}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-700"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#10c38b]" />
              </div>
            ) : accounts?.length === 0 ? (
              <Alert className="bg-dark-700 border-zinc-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-white">Nenhuma conta conectada</AlertTitle>
                <AlertDescription className="text-zinc-400">
                  Conecte sua primeira conta do Facebook Ads usando o botão acima.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {accounts?.map((account) => (
                  <Card key={account.id} className="bg-dark-700 border-zinc-800">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">
                          {account.account_name || account.account_id}
                        </p>
                        <p className="text-sm text-zinc-400">
                          ID: {account.account_id}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm">
                          {account.status === "active" ? (
                            <div className="flex items-center text-[#10c38b]">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span>Ativa</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-zinc-400">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span>Desabilitada</span>
                            </div>
                          )}
                        </div>
                        <Switch
                          checked={account.status === "active"}
                          onCheckedChange={(checked) => handleToggleAccount(account, checked)}
                          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-700"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacebookIntegration;
