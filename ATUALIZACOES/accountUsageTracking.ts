import { supabase } from "./supabaseClient";

/**
 * Verifica o uso atual da conta e limites disponíveis
 * @param userId ID do usuário para verificar o uso
 * @returns Objeto contendo informações de uso e limites
 */
export const checkAccountUsage = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('account_plans')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    console.log("Dados do plano obtidos:", data);
    
    // Verifica se o plano possui os limites corretos baseados no tipo de plano
    let leadsLimit = data?.leads_limit || 0;
    
    // Corrige os limites com base no plano
    switch (data?.plan_type?.toLowerCase()) {
      case 'baby':
        leadsLimit = 300;
        break;
      case 'start':
        leadsLimit = 1500;
        break;
      case 'pro':
        leadsLimit = 3000;
        break;
      case 'escale':
        leadsLimit = 9000;
        break;
      default:
        // Plano Free ou qualquer outro
        leadsLimit = 0;
    }
    
    // Se os limites no banco estiverem incorretos, atualizá-los
    if (data && data.leads_limit !== leadsLimit) {
      console.log(`Atualizando limites de ${data.plan_type} para: ${leadsLimit} leads`);
      
      // Atualizar diretamente na tabela account_plans
      const { error: updateError } = await supabase
        .from('account_plans')
        .update({ leads_limit: leadsLimit })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error("Erro ao atualizar limites do plano:", updateError);
      } else {
        console.log("Limites atualizados com sucesso no banco de dados");
      }
    }
    
    return {
      currentLeadsUsage: data?.current_leads_usage || 0,
      leadsLimit: leadsLimit,
      planType: data?.plan_type || 'Free',
      resetDate: data?.cycle_reset_date || null,
      isLimitReached: (data?.current_leads_usage || 0) >= leadsLimit
    };
  } catch (error) {
    console.error("Erro ao verificar uso da conta:", error);
    return {
      currentLeadsUsage: 0,
      leadsLimit: 0,
      planType: 'Free',
      resetDate: null,
      isLimitReached: false,
      error
    };
  }
};

/**
 * Incrementa o uso de leads para um usuário
 * @param userId ID do usuário para incrementar o uso
 * @returns Resultado da operação
 */
export const incrementLeadUsage = async (userId: string) => {
  try {
    // First, get the current usage
    const { data: currentData, error: fetchError } = await supabase
      .from('account_plans')
      .select('current_leads_usage')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with the incremented value
    const newValue = (currentData?.current_leads_usage || 0) + 1;
    
    const { data, error } = await supabase
      .from('account_plans')
      .update({ current_leads_usage: newValue })
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao incrementar uso de leads:", error);
    return { success: false, error };
  }
};
