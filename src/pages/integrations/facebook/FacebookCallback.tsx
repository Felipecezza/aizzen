import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FacebookCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");

        if (!accessToken) {
          throw new Error("Token de acesso não encontrado");
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        const response = await fetch("https://graph.facebook.com/v18.0/me/adaccounts", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        if (!data.data?.[0]) {
          throw new Error("Nenhuma conta de anúncios encontrada");
        }

        const adAccount = data.data[0];

        const { error } = await supabase.from("facebook_ad_accounts").insert({
          user_id: user.id,
          account_id: adAccount.account_id,
          access_token: accessToken,
          account_name: adAccount.name,
          status: "active",
        });

        if (error) throw error;

        window.opener.postMessage({ type: "FACEBOOK_AUTH_SUCCESS" }, "*");
        window.close();
      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        window.opener.postMessage({ type: "FACEBOOK_AUTH_ERROR", error: errorMessage }, "*");
        window.close();
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Conectando sua conta...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto" />
      </div>
    </div>
  );
};

export default FacebookCallback;