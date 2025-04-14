import { getStatusTailwindClass, getStatusColor } from "@/styles/colorSystem";
import { supabase } from "@/lib/supabase";
import { incrementSalesCount } from "./accountUsageTracking";

// Export our color system functions for use in components
export { getStatusTailwindClass, getStatusColor };

/**
 * Atualiza o status de um agendamento
 * Quando o status muda para "Concluído", incrementa o contador de vendas
 * 
 * @param leadId ID do lead a ser atualizado
 * @param status Novo status do agendamento
 * @param productTable Nome da tabela de produto (ex: lead_menosense)
 * @param userId ID do usuário dono do lead
 * @returns Resultado da operação
 */
export const updateAppointmentStatus = async (
  leadId: string,
  status: string,
  productTable: string,
  userId: string
) => {
  try {
    // Obter o status atual para verificar se está mudando para "Concluído"
    const { data: currentData, error: fetchError } = await supabase
      .from(productTable)
      .select('agendamento, user_id')
      .eq('id', leadId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Atualizar o status do agendamento
    const { data, error } = await supabase
      .from(productTable)
      .update({ agendamento: status })
      .eq('id', leadId)
      .select();
    
    if (error) throw error;
    
    let saleRegistered = false;
    
    // Se o status está mudando para "Concluído", incrementar o contador de vendas
    if (status === "Concluído" && currentData?.agendamento !== "Concluído") {
      console.log("Status alterado para Concluído, incrementando vendas");
      const ownerId = currentData?.user_id || userId;
      const saleResult = await incrementSalesCount(ownerId);
      console.log("Resultado do incremento de vendas:", saleResult);
      saleRegistered = saleResult.success;
    }
    
    return { 
      success: true,
      data,
      saleRegistered
    };
  } catch (error) {
    console.error("Erro ao atualizar status do agendamento:", error);
    return { success: false, error };
  }
};

/**
 * Obtém a contagem de vendas de um usuário
 * 
 * @param userId ID do usuário
 * @returns Contagem de vendas
 */
export const getSalesCount = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('account_plans')
      .select('sales_count')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.sales_count || 0;
  } catch (error) {
    console.error("Erro ao obter contagem de vendas:", error);
    return 0;
  }
};
