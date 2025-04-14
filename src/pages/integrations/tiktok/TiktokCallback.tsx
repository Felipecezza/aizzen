import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

const TiktokCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: handleAuth } = useMutation({
    mutationFn: async (auth_code: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Call Supabase Edge Function to exchange auth code for access token
      const { data, error } = await supabase.functions.invoke('tiktok-auth', {
        body: { auth_code }
      });

      if (error) throw error;

      // Save the account to database
      const { error: dbError } = await supabase
        .from("tiktok_ad_accounts")
        .insert({
          user_id: user.id,
          advertiser_id: data.advertiser_id,
          advertiser_name: data.advertiser_name,
          access_token: data.access_token,
          status: "active",
        });

      if (dbError) throw dbError;

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Conta conectada com sucesso!",
        description: "Seus dados começarão a ser sincronizados em breve.",
      });
      navigate("/integrations/tiktok");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao conectar conta",
        description: error.message,
      });
      navigate("/integrations/tiktok");
    },
  });

  useEffect(() => {
    const auth_code = searchParams.get("auth_code");
    if (auth_code) {
      handleAuth(auth_code);
    }
  }, [searchParams, handleAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Conectando sua conta...</h1>
        <p className="text-muted-foreground">Por favor, aguarde enquanto processamos sua autenticação.</p>
      </div>
    </div>
  );
};

export default TiktokCallback;