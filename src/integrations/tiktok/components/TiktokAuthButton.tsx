import { Button } from "@/components/ui/button";
import { TIKTOK_CONFIG } from "../config";

export const TiktokAuthButton = () => {
  const handleAuth = () => {
    const params = new URLSearchParams({
      app_id: TIKTOK_CONFIG.app_id,
      state: crypto.randomUUID(),
      redirect_uri: TIKTOK_CONFIG.redirect_uri,
      scope: "ads.read ads.write",
    });

    window.location.href = `${TIKTOK_CONFIG.auth_url}?${params.toString()}`;
  };

  return (
    <Button 
      onClick={handleAuth}
      className="w-full bg-[#10c38b] hover:bg-[#0ea677] text-white"
    >
      Conectar conta TikTok Ads
    </Button>
  );
};