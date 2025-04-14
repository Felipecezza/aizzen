import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MetricCard } from "@/components/MetricCard";
import { CampaignTable } from "@/components/analytics/CampaignTable";
import { OptimizationSuggestions } from "@/components/analytics/OptimizationSuggestions";
import { TrafficMetrics } from "@/components/analytics/TrafficMetrics";
import { useNavigate } from "react-router-dom";
import DevLockOverlay from "@/components/DevLockOverlay";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("facebook");
  const navigate = useNavigate();

  const { data: facebookAccounts, isLoading: isLoadingFacebook } = useQuery({
    queryKey: ["facebook-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facebook_ad_accounts")
        .select("*")
        .eq("status", "active");
      
      if (error) throw error;
      return data;
    }
  });

  const { data: tiktokAccounts, isLoading: isLoadingTiktok } = useQuery({
    queryKey: ["tiktok-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tiktok_ad_accounts")
        .select("*")
        .eq("status", "active");
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoadingFacebook || isLoadingTiktok) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const noConnectedAccounts = (!facebookAccounts || facebookAccounts.length === 0) && 
                             (!tiktokAccounts || tiktokAccounts.length === 0);

  if (noConnectedAccounts) {
    return (
      <div className="max-w-7xl mx-auto">
        <Alert className="bg-zinc-800 border-zinc-700">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <AlertTitle className="text-white">Nenhuma conta conectada</AlertTitle>
          <AlertDescription className="text-white">
            Conecte suas contas de Facebook Ads ou TikTok Ads para visualizar as métricas e otimizações.
          </AlertDescription>
          <div className="mt-4 flex gap-4">
            <Button 
              onClick={() => navigate("/integrations/facebook")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Conectar Facebook Ads
            </Button>
            <Button 
              onClick={() => navigate("/integrations/tiktok")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Conectar TikTok Ads
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400">
          {/* ... existing text ... */}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Existing cards with DevLockOverlay */}
        <Card className="bg-dark-700 border-zinc-800 relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">Visitantes</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-sm text-gray-400">Nos últimos 30 dias</p>
          </CardContent>
          <DevLockOverlay />
        </Card>
        
        {/* Repeat for each card with DevLockOverlay */}
      </div>

      {/* Main Analytics Dashboard with relative container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Traffic metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* ... existing content ... */}
          <DevLockOverlay />
        </div>

        {/* Optimization suggestions */}
        <div className="space-y-6 relative">
          {/* ... existing content ... */}
          <DevLockOverlay />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
