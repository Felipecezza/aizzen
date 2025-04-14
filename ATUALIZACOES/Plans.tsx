
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface PlanFeature {
  id: string;
  plan_id: string;
  feature: string;
}

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  period: string;
  messages_limit: number;
  highlight: boolean;
  features: string[];
}

interface AdditionalService {
  id: string;
  name: string;
  type: string;
  price: number;
  period: string;
  description: string;
}

const Plans = () => {
  const [isAnnual] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const {
    data: plans = [],
    isLoading: plansLoading,
    error: plansError,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<Plan[]> => {
      console.log("Fetching plans from Supabase");
      
      try {
        const {
          data: plansData,
          error: plansError
        } = await supabase.from("pricing_plans").select("*").order("messages_limit");
        
        if (plansError) {
          console.error("Error fetching plans:", plansError);
          toast.error("Erro ao carregar planos");
          throw plansError;
        }
        
        console.log("Fetched plans:", plansData);

        // Get plan features
        const featuresByPlan: Record<string, string[]> = {};
        
        for (const plan of plansData) {
          const {
            data: featuresData,
            error: featuresError
          } = await supabase
            .from("plan_features")
            .select("feature")
            .eq("plan_id", plan.id);
          
          if (featuresError) {
            console.error(`Error fetching features for plan ${plan.id}:`, featuresError);
            featuresByPlan[plan.id] = [];
          } else {
            console.log(`Features for plan ${plan.name}:`, featuresData);
            featuresByPlan[plan.id] = featuresData.map(f => f.feature);
          }
        }

        return plansData.map(plan => ({
          ...plan,
          features: featuresByPlan[plan.id] || []
        }));
      } catch (error) {
        console.error("Error in plans query:", error);
        toast.error("Erro ao carregar planos");
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute cache
    gcTime: 300000 // 5 minutes - Updated from cacheTime to gcTime
  });

  const {
    data: additionalServices = [],
    isLoading: servicesLoading
  } = useQuery({
    queryKey: ["additionalServices"],
    queryFn: async (): Promise<AdditionalService[]> => {
      const {
        data,
        error
      } = await supabase.from("additional_services").select("*");
      if (error) {
        toast.error("Erro ao carregar serviços adicionais");
        throw error;
      }
      return data;
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const handleUpgrade = async (planType: string) => {
    try {
      setUpgrading(planType);
      
      if (planType === "escale") {
        toast.info("Nossa equipe de vendas entrará em contato em breve!");
        setUpgrading(null);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para fazer upgrade");
        setUpgrading(null);
        return;
      }

      // Chame a função RPC que atualizará os limites do plano
      const { error } = await supabase.rpc('update_plan_limits', {
        user_uuid: user.id,
        plan_name: planType
      });

      if (error) {
        console.error("Erro ao atualizar plano:", error);
        toast.error(`Erro ao fazer upgrade: ${error.message}`);
        setUpgrading(null);
        return;
      }

      toast.success("Upgrade realizado com sucesso!");
      // After successful upgrade, refetch plans to ensure UI is up-to-date
      refetchPlans();
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Ocorreu um erro ao processar sua solicitação");
    } finally {
      setUpgrading(null);
    }
  };

  if (plansLoading || servicesLoading) {
    return <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Carregando planos...</h2>
          </div>
        </div>
      </Layout>;
  }

  if (plansError) {
    return <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Erro ao carregar planos</h2>
            <p className="text-gray-400">Tente novamente mais tarde</p>
          </div>
        </div>
      </Layout>;
  }

  return <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Planos e Preços</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(plan => <div key={plan.id} className={`rounded-lg p-6 ${plan.highlight ? "bg-primary/10 border-2 border-primary" : "bg-dark-700 border border-zinc-800"}`}>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    R$ {plan.price}
                  </span>
                  {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                </div>
                {plan.messages_limit && <div className="flex items-center justify-center mt-2 text-gray-400">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>{plan.messages_limit} leads/mês</span>
                  </div>}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features && plan.features.length > 0 ? (
                  plan.features.map(feature => <li key={feature} className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>)
                ) : (
                  <li className="text-gray-500 text-center text-sm">Sem funcionalidades</li>
                )}
              </ul>

              <Button 
                onClick={() => handleUpgrade(plan.type)} 
                className={`w-full bg-primary hover:bg-primary/90`}
                disabled={upgrading === plan.type}
              >
                {upgrading === plan.type ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2 border-white" />
                    Processando...
                  </>
                ) : (
                  plan.type === "escale" ? "Falar com Vendas" : "Fazer Upgrade"
                )}
              </Button>
            </div>)}
        </div>

        <div className="mt-12 p-4 bg-dark-700 rounded-lg border border-zinc-800">
          <div className="flex items-center text-gray-300">
            <AlertCircle className="w-5 h-5 mr-2 text-primary" />
            <span>
              Precisa de mais leads? Entre em contato com nossa equipe de vendas
              para um plano personalizado.
            </span>
          </div>
        </div>
      </div>
    </Layout>;
};

export default Plans;
