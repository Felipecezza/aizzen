import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { auth_code } = await req.json();

    // Exchange auth code for access token
    const tokenResponse = await fetch("https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: Deno.env.get("TIKTOK_APP_ID"),
        secret: Deno.env.get("TIKTOK_APP_SECRET"),
        auth_code,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.data?.access_token) {
      throw new Error("Failed to get access token");
    }

    // Get advertiser info
    const advertiserResponse = await fetch("https://business-api.tiktok.com/open_api/v1.3/oauth2/advertiser/get/", {
      method: "GET",
      headers: {
        "Access-Token": tokenData.data.access_token,
      },
    });

    const advertiserData = await advertiserResponse.json();

    if (!advertiserData.data?.advertiser_ids?.[0]) {
      throw new Error("Failed to get advertiser info");
    }

    return new Response(
      JSON.stringify({
        access_token: tokenData.data.access_token,
        advertiser_id: advertiserData.data.advertiser_ids[0],
        advertiser_name: advertiserData.data.advertiser_names?.[0] || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});