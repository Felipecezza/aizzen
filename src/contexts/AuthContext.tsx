import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  accountId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  accountId: null,
  signOut: async () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar a conta associada ao usuário
    const fetchUserAccount = async (userId: string) => {
      try {
        // Assumimos que o usuário tem o próprio ID como account_id temporário
        // até que as tabelas necessárias estejam criadas no Supabase
        console.log('Usando ID do usuário como ID da conta temporariamente');
        return userId;
        
        /* Código original comentado para evitar carregamento infinito
        // Buscar na tabela account_users
        const { data, error } = await supabase
          .from('account_users')
          .select('account_id')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Erro ao buscar conta do usuário:', error);
          
          // Se não encontrar na account_users, tenta criar uma nova conta
          const { data: newAccount, error: newAccountError } = await supabase
            .from('accounts')
            .insert({ name: 'Conta Padrão' })
            .select('id')
            .single();
            
          if (newAccountError) {
            console.error('Erro ao criar nova conta:', newAccountError);
            return null;
          }
          
          // Associa o usuário à nova conta
          if (newAccount) {
            const { error: linkError } = await supabase
              .from('account_users')
              .insert({
                user_id: userId,
                account_id: newAccount.id,
                role: 'owner'
              });
              
            if (linkError) {
              console.error('Erro ao associar usuário à conta:', linkError);
              return null;
            }
            
            return newAccount.id;
          }
          
          return null;
        }

        return data?.account_id || null;
        */
      } catch (error) {
        console.error('Erro inesperado ao buscar conta:', error);
        // Retornamos o ID do usuário como fallback
        return userId;
      }
    };

    // Função para inicializar a sessão
    const initSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const accId = await fetchUserAccount(session.user.id);
          setAccountId(accId);
          console.log('Conta associada:', accId);
          
          // Redirecionar o usuário se ele estiver na página de login mas já tem sessão
          if (window.location.pathname === '/' || window.location.pathname === '/login') {
            window.location.href = '/account';
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    // Inicializa a sessão
    initSession();

    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN') {
        console.log("Usuário fez login com sucesso");
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const accId = await fetchUserAccount(session.user.id);
          setAccountId(accId);
          
          // Redirecionar após login
          if (window.location.pathname === '/' || window.location.pathname === '/login') {
            window.location.href = '/account';
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Usuário deslogou");
        setSession(null);
        setUser(null);
        setAccountId(null);
        
        // Redirecionar para login após logout
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      } else {
        // Para outros eventos, apenas atualizamos o estado
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const accId = await fetchUserAccount(session.user.id);
          setAccountId(accId);
        } else {
          setAccountId(null);
        }
      }
      
      setLoading(false);
    });

    // Cleanup da subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value = {
    session,
    user,
    loading,
    accountId,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 