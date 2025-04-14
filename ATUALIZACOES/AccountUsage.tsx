
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { checkAccountUsage } from "@/utils/accountUsageTracking";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const AccountUsage = () => {
  const [loading, setLoading] = useState(true);
  const [updatingLimits, setUpdatingLimits] = useState(false);
  const [accountUsage, setAccountUsage] = useState({
    currentLeadsUsage: 0,
    leadsLimit: 0,
    planType: 'Free',
    resetDate: null,
    isLimitReached: false
  });
  
  const leadsPercentage = accountUsage.leadsLimit > 0 
    ? (accountUsage.currentLeadsUsage / accountUsage.leadsLimit) * 100 
    : 0;

  useEffect(() => {
    fetchAccountUsage();
  }, []);
  
  const fetchAccountUsage = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Usar a função de utilidade para obter dados de uso
      const usageData = await checkAccountUsage(user.id);
      
      if (usageData) {
        setAccountUsage(usageData);
      }
    } catch (error) {
      console.error("Erro ao buscar uso da conta:", error);
      toast.error("Não foi possível carregar informações de uso da conta");
    } finally {
      setLoading(false);
    }
  };
  
  // Função para forçar uma atualização dos limites
  const forceUpdateLimits = async () => {
    try {
      setUpdatingLimits(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }
      
      const { error } = await supabase.rpc('update_plan_limits', {
        user_uuid: user.id,
        plan_name: accountUsage.planType.toLowerCase()
      });
      
      if (error) {
        console.error("Erro ao atualizar limites do plano:", error);
        toast.error("Erro ao atualizar limites");
      } else {
        toast.success("Limites atualizados com sucesso");
        // Recarregar os dados após a atualização
        await fetchAccountUsage();
      }
    } catch (error) {
      console.error("Erro ao forçar atualização dos limites:", error);
      toast.error("Erro ao atualizar limites do plano");
    } finally {
      setUpdatingLimits(false);
    }
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="rounded-lg bg-dark-700 p-6 space-y-4 border border-zinc-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Uso da Conta</h3>
        {!loading && (
          <button 
            onClick={forceUpdateLimits} 
            className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center"
            disabled={updatingLimits}
          >
            {updatingLimits ? (
              <>
                <LoadingSpinner className="w-3 h-3 border-primary mr-1" />
                Atualizando...
              </>
            ) : (
              'Atualizar limites'
            )}
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">Plano atual: {accountUsage.planType}</span>
              <span className="text-white">
                {accountUsage.currentLeadsUsage} de {accountUsage.leadsLimit} leads
              </span>
            </div>
            <Progress 
              value={leadsPercentage} 
              className="h-2 bg-zinc-800 [&>div]:bg-amber-500" 
            />
            {accountUsage.resetDate && (
              <p className="text-xs text-zinc-400">
                Próximo reset em: {formatDate(accountUsage.resetDate)}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-zinc-400">
          Seu plano permite {accountUsage.leadsLimit} leads por mês.
          {leadsPercentage > 80 && (
            <span className="text-yellow-500 ml-1">
              Você está próximo do limite de leads.
            </span>
          )}
          {accountUsage.isLimitReached && (
            <span className="text-red-500 ml-1">
              Limite de leads atingido. Faça upgrade do seu plano.
            </span>
          )}
        </p>
        <a 
          href="/plans" 
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Fazer upgrade
        </a>
      </div>
    </div>
  );
};

export default AccountUsage;
