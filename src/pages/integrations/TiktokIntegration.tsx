import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types/tables";
import Layout from "@/components/Layout";
import { TiktokAuthButton } from "@/integrations/tiktok/components/TiktokAuthButton";

type TiktokAdAccount = Tables["tiktok_ad_accounts"]["Row"];

const TiktokIntegration = () => {
  // Get current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch connected accounts
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["tiktok-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tiktok_ad_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TiktokAdAccount[];
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">TikTok Ads</h2>
          <p className="text-zinc-400 mt-2">
            Conecte suas contas do TikTok Ads para sincronizar seus dados automaticamente.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Conectar Nova Conta</CardTitle>
            <CardDescription className="text-zinc-400">
              Clique no botão abaixo para conectar sua conta do TikTok Ads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TiktokAuthButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Contas Conectadas</CardTitle>
            <CardDescription className="text-zinc-400">
              Gerencie suas contas do TikTok Ads conectadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#10c38b]" />
              </div>
            ) : accounts?.length === 0 ? (
              <Alert className="bg-dark-700 border-zinc-800 text-zinc-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma conta conectada</AlertTitle>
                <AlertDescription className="text-zinc-400">
                  Conecte sua primeira conta do TikTok Ads usando o botão acima.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {accounts?.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">
                          {account.advertiser_name || account.advertiser_id}
                        </p>
                        <p className="text-sm text-zinc-400">
                          ID: {account.advertiser_id}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {account.status === "active" ? (
                          <div className="flex items-center text-[#10c38b]">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            <span className="text-sm">Conectado</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-500">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Desconectado</span>
                          </div>
                        )}
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

export default TiktokIntegration;
