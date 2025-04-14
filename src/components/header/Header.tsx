import { useNavigate } from "react-router-dom";
import { Bell, X, Trash2, Shield } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  time: string;
  created_at?: string;
}

interface UserData {
  full_name?: string;
  avatar_url?: string;
}

interface HeaderProps {
  notifications: Notification[];
  userData: UserData;
  isLoading?: boolean;
}

export const Header = ({
  notifications: initialNotifications,
  userData,
  isLoading = false
}: HeaderProps) => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useSuperAdmin();
  const { user, accountId } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  
  // Extrair o primeiro nome e a inicial
  const [firstName, setFirstName] = useState<string>("");
  const [userInitial, setUserInitial] = useState<string>("U");
  
  useEffect(() => {
    if (userData?.full_name) {
      // Extrair o primeiro nome
      const parts = userData.full_name.trim().split(' ');
      setFirstName(parts[0]);
      
      // Extrair a inicial (primeiro caractere do nome completo)
      setUserInitial(userData.full_name.trim().charAt(0).toUpperCase());
    } else {
      setFirstName("");
      setUserInitial("U");
    }
  }, [userData]);

  // Buscar notificações do usuário
  useEffect(() => {
    if (!user || !accountId) return;
    
    fetchNotifications();
    
    // Configurar listener para novas notificações
    const channel = supabase
      .channel(`notifications-${accountId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'notifications',
          filter: `account_id=eq.${accountId}`
        },
        (payload) => {
          console.log('Mudança em notificações:', payload);
          // Atualizar a lista de notificações
          fetchNotifications();
          
          // Se for uma nova notificação, mostrar toast
          if (payload.eventType === 'INSERT') {
            toast.info("Nova notificação", {
              description: payload.new.message
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, accountId]);
  
  const fetchNotifications = async () => {
    if (!accountId) return;
    
    try {
      setIsLoadingNotifications(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      const formattedNotifications = data.map(item => ({
        id: item.id,
        message: item.message,
        time: formatNotificationTime(item.created_at),
        created_at: item.created_at
      }));
      
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };
  
  const formatNotificationTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  // Handler para limpar notificações
  const handleClearNotifications = async () => {
    if (!accountId) {
      toast.error("Não foi possível identificar sua conta");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('account_id', accountId);
        
      if (error) throw error;
      
      setNotifications([]);
      toast.success("Notificações removidas com sucesso");
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
      toast.error("Não foi possível limpar as notificações");
    }
  };
  
  // Handler para remover notificação específica
  const handleRemoveNotification = async (notificationId: string) => {
    if (!accountId) {
      toast.error("Não foi possível identificar sua conta");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('account_id', accountId);
        
      if (error) throw error;
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      toast.error("Não foi possível remover a notificação");
    }
  };

  return (
    <div className="sticky top-0 z-10 w-full border-b border-[#191a1a] bg-[#0a0a0a]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex space-x-4">
          <div className="hidden md:flex space-x-1"></div>
        </div>
        <div className="flex items-center">
          {isSuperAdmin}
          
          <div className="flex items-center space-x-1">
            <Popover>
              <PopoverTrigger className="mx-0 px-0">
                <div className="relative">
                  <Bell className="h-4 w-4 text-[#e2e2e2] hover:text-[#f8f8f8] transition-colors" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-xs text-dark-700">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-dark-700 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#f8f8f8]">Notificações</h4>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClearNotifications} className="h-8 px-2 py-1 text-xs">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Limpar todas
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className="flex items-start justify-between rounded-md p-2 hover:bg-zinc-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-[#f8f8f8]">{notification.message}</p>
                          <p className="text-xs text-[#e2e2e2]">{notification.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#e2e2e2] hover:text-[#f8f8f8] hover:bg-zinc-600"
                          onClick={() => handleRemoveNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-[#e2e2e2]">
                      Nenhuma notificação
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center cursor-pointer ml-1" onClick={() => navigate("/account")}>
              {isLoading ? (
                <Skeleton className="h-7 w-7 rounded-full" />
              ) : userData?.avatar_url ? (
                <div className="h-7 w-7 rounded-full overflow-hidden">
                  <img src={userData.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-center text-black">
                  {userInitial}
                </div>
              )}
              <div className="flex flex-col items-start space-y-0.5 ml-2">
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="text-[#e2e2e2] text-sm">
                    {firstName || "Usuário"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
