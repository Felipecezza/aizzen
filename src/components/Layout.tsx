import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./header/Header";

const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const [userData, setUserData] = useState<{
    full_name?: string;
    avatar_url?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && isSidebarCollapsed) {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  // Configura um listener para mudanças na tabela profiles
  useEffect(() => {
    if (!userId) return;

    // Assina mudanças na tabela profiles para o usuário atual
    const channel = supabase
      .channel(`profile-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log('Perfil atualizado:', payload);
          // Atualiza os dados do usuário quando o perfil for alterado
          if (payload.new) {
            setUserData({
              full_name: payload.new.full_name,
              avatar_url: payload.new.avatar_url
            });
          }
        }
      )
      .subscribe();

    // Limpa a assinatura quando o componente for desmontado
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        const {
          data
        } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
        
        if (data) {
          setUserData(data);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Overlay para mobile quando o menu está aberto */}
      {!isSidebarCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed} 
      />
      
      <main className={`
        min-h-screen pl-20
        ${!isMobile && !isSidebarCollapsed ? "pl-64" : ""}
      `}>
        <Header 
          notifications={[]}  
          userData={userData}
          isLoading={isLoading}
        />

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
