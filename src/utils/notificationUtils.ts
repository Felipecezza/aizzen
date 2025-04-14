import { supabase } from "@/lib/supabase";

interface NotificationOptions {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Envia uma notificação para um usuário
 * @param accountId ID da conta do usuário
 * @param options Opções da notificação
 * @returns ID da notificação criada ou null se houver erro
 */
export const sendNotification = async (
  accountId: string,
  options: NotificationOptions
): Promise<string | null> => {
  try {
    if (!accountId) {
      console.error('ID da conta não fornecido');
      return null;
    }

    const { data: auth } = await supabase.auth.getSession();
    const userId = auth.session?.user?.id;

    const notification = {
      account_id: accountId,
      message: options.message,
      type: options.type || 'info',
      link: options.link,
      metadata: options.metadata,
      created_by: userId,
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao criar notificação:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Erro inesperado ao enviar notificação:', error);
    return null;
  }
};

/**
 * Marca uma notificação como lida
 * @param notificationId ID da notificação
 * @param accountId ID da conta do usuário (para verificação de segurança)
 * @returns true se a notificação foi marcada como lida, false caso contrário
 */
export const markNotificationAsRead = async (
  notificationId: string,
  accountId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('account_id', accountId);

    if (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao marcar notificação como lida:', error);
    return false;
  }
};

/**
 * Limpa todas as notificações de uma conta
 * @param accountId ID da conta
 * @returns Número de notificações removidas ou -1 se houver erro
 */
export const clearAllNotifications = async (accountId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('account_id', accountId)
      .select('count');

    if (error) {
      console.error('Erro ao limpar notificações:', error);
      return -1;
    }

    return data?.[0]?.count || 0;
  } catch (error) {
    console.error('Erro inesperado ao limpar notificações:', error);
    return -1;
  }
};

/**
 * Exemplo de uso:
 * 
 * // Para enviar uma notificação
 * const notificationId = await sendNotification(accountId, {
 *   message: 'Novo pedido recebido!',
 *   type: 'success',
 *   link: '/orders/123',
 *   metadata: { orderId: '123' }
 * });
 * 
 * // Para marcar como lida
 * await markNotificationAsRead(notificationId, accountId);
 * 
 * // Para limpar todas as notificações
 * await clearAllNotifications(accountId);
 */ 