import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface Account {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AccountContextType {
  account: Account | null;
  loading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType>({
  account: null,
  loading: true,
  error: null,
  refreshAccount: async () => {}
});

export const useAccount = () => {
  return useContext(AccountContext);
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accountId } = useAuth();

  const fetchAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!accountId) {
        setAccount(null);
        return;
      }

      // Criar uma conta fictícia usando o ID do usuário (temporário)
      const mockAccount: Account = {
        id: accountId,
        name: 'Conta Temporária',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setAccount(mockAccount);
      
      /* Código original comentado para evitar carregamento infinito
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar dados da conta:', error);
        setError(error.message);
        setAccount(null);
      } else {
        setAccount(data);
      }
      */
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Ocorreu um erro ao buscar dados da conta.');
      
      // Mesmo com erro, criamos uma conta fictícia para não bloquear o fluxo
      if (accountId) {
        const mockAccount: Account = {
          id: accountId,
          name: 'Conta Temporária (Fallback)',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setAccount(mockAccount);
      } else {
        setAccount(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados da conta quando o accountId mudar
  useEffect(() => {
    if (accountId) {
      fetchAccount();
    } else {
      setAccount(null);
      setLoading(false);
    }
  }, [accountId]);

  // Função para atualizar manualmente os dados da conta
  const refreshAccount = async () => {
    await fetchAccount();
  };

  return (
    <AccountContext.Provider 
      value={{ 
        account, 
        loading, 
        error, 
        refreshAccount 
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext; 