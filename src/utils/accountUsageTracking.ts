import { supabase } from "@/lib/supabase";

interface AccountUsageData {
  currentLeadsUsage: number;
  leadsLimit: number;
  planType: string;
  resetDate: string | null;
  isLimitReached: boolean;
}

/**
 * Verifica o uso atual da conta e limites disponíveis
 * @param userId ID do usuário para verificar o uso
 * @returns Objeto contendo informações de uso e limites
 */
export const checkAccountUsage = async (userId: string): Promise<AccountUsageData | null> => {
  try {
    console.log("Checking account usage for user:", userId);
    
    // Buscar dados do plano atual do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_type, plan_reset_date, leads_limit, leads_usage')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Erro ao buscar dados do perfil:', profileError);
      return null;
    }
    
    // Se não houver dados de perfil ou não tiver tipo de plano, use valores padrão
    if (!profileData) {
      console.log('Perfil não encontrado, usando valores padrão');
      return {
        currentLeadsUsage: 0,
        leadsLimit: 100, // Limite padrão para plano gratuito
        planType: 'Baby',
        resetDate: null,
        isLimitReached: false
      };
    }
    
    // Obter dados de uso atuais
    const currentLeadsUsage = profileData.leads_usage || 0;
    let leadsLimit = profileData.leads_limit || 100; // Valor padrão se não estiver definido
    const planType = profileData.plan_type || 'Baby';
    const resetDate = profileData.plan_reset_date;
    
    // Verificar qual é o plano e atualizar o limite se necessário
    if (!profileData.leads_limit || profileData.leads_limit <= 0) {
      // Definir limite com base no tipo de plano
      switch (planType.toLowerCase()) {
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
          leadsLimit = 300; // Valor padrão se o tipo de plano não for reconhecido
      }
      
      // Atualizar o limite no perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ leads_limit: leadsLimit })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Erro ao atualizar limite de leads:', updateError);
      } else {
        console.log(`Limite de leads atualizado para ${leadsLimit} para o plano ${planType}`);
      }
    }

    console.log('Dados de uso recuperados:', {
      currentLeadsUsage,
      leadsLimit,
      planType,
      resetDate
    });
    
    // Retornar dados formatados
    return {
      currentLeadsUsage,
      leadsLimit,
      planType,
      resetDate,
      isLimitReached: currentLeadsUsage >= leadsLimit
    };
  } catch (error) {
    console.error('Erro ao verificar uso da conta:', error);
    return null;
  }
};

/**
 * Incrementa o contador de uso (conversas/leads) para um usuário
 * Esta função incrementa tanto current_usage quanto current_leads_usage
 * para manter a consistência entre os dois campos
 * @param userId ID do usuário para incrementar o uso
 * @returns Resultado da operação
 */
export const incrementUsage = async (userId: string) => {
  try {
    // Obter o uso atual
    const { data: currentData, error: fetchError } = await supabase
      .from('account_plans')
      .select('current_usage, current_leads_usage, messages_limit, leads_limit')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Calcular os novos valores (incrementando ambos)
    const newUsage = (currentData?.current_usage || 0) + 1;
    const newLeadsUsage = (currentData?.current_leads_usage || 0) + 1;
    const messagesLimit = currentData?.messages_limit || 0;
    const leadsLimit = currentData?.leads_limit || 0;
    
    // Atualizar ambos os campos para manter a consistência
    const { data, error } = await supabase
      .from('account_plans')
      .update({ 
        current_usage: newUsage,
        current_leads_usage: newLeadsUsage
      })
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    
    return { 
      success: true, 
      data,
      usage: newUsage,
      leadsUsage: newLeadsUsage,
      isLeadsLimitReached: newLeadsUsage >= leadsLimit,
      isMessagesLimitReached: newUsage >= messagesLimit
    };
  } catch (error) {
    console.error("Erro ao incrementar contador de uso:", error);
    return { success: false, error };
  }
};

/**
 * Incrementa o contador de vendas quando um agendamento muda para Concluído
 * @param userId ID do usuário para incrementar o contador de vendas
 * @returns Resultado da operação
 */
export const incrementSalesCount = async (userId: string) => {
  try {
    // Obter o contador atual de vendas
    const { data: currentData, error: fetchError } = await supabase
      .from('account_plans')
      .select('sales_count')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Incrementar o contador de vendas
    const newSalesCount = (currentData?.sales_count || 0) + 1;
    
    // Atualizar o contador no banco de dados
    const { data, error } = await supabase
      .from('account_plans')
      .update({ 
        sales_count: newSalesCount
      })
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    
    return { 
      success: true, 
      data,
      salesCount: newSalesCount
    };
  } catch (error) {
    console.error("Erro ao incrementar contador de vendas:", error);
    return { success: false, error };
  }
};

// Manter função para compatibilidade com código existente
export const incrementLeadUsage = incrementUsage; 