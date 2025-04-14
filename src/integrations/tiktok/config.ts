export const TIKTOK_CONFIG = {
  app_id: import.meta.env.VITE_TIKTOK_APP_ID,
  app_secret: import.meta.env.VITE_TIKTOK_APP_SECRET,
  auth_url: "https://ads.tiktok.com/marketing_api/auth",
  redirect_uri: import.meta.env.VITE_APP_URL + "/integrations/tiktok/callback",
};