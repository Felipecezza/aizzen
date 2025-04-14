import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";

const FACEBOOK_CONFIG = {
  app_id: "1442973806619971",
  redirect_uri: `${window.location.origin}/integrations/facebook/callback`,
  scope: "ads_management,ads_read",
};

export const FacebookAuthButton = () => {
  const handleAuth = () => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const params = new URLSearchParams({
      client_id: FACEBOOK_CONFIG.app_id,
      redirect_uri: FACEBOOK_CONFIG.redirect_uri,
      scope: FACEBOOK_CONFIG.scope,
      response_type: "token",
      state: crypto.randomUUID(),
    });

    window.open(
      `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`,
      "facebook-auth-popup",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <Button 
      onClick={handleAuth}
      className="w-full bg-[#10c38b] hover:bg-[#0ea67a] text-white"
    >
      <Facebook className="mr-2 h-4 w-4" />
      Conectar conta Facebook Ads
    </Button>
  );
};