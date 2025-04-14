import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatwootAccount {
  id: string;
  name: string;
  baseUrl?: string;
  position?: 'left' | 'right';
  primaryColor?: string;
}

interface ChatwootContextType {
  currentAccount: ChatwootAccount | null;
  accounts: ChatwootAccount[];
  setCurrentAccount: (account: ChatwootAccount) => void;
  addAccount: (account: ChatwootAccount) => void;
  removeAccount: (accountId: string) => void;
}

const ChatwootContext = createContext<ChatwootContextType | undefined>(undefined);

export function ChatwootProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<ChatwootAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<ChatwootAccount | null>(null);

  const addAccount = (account: ChatwootAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const removeAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    if (currentAccount?.id === accountId) {
      setCurrentAccount(null);
    }
  };

  return (
    <ChatwootContext.Provider
      value={{
        currentAccount,
        accounts,
        setCurrentAccount,
        addAccount,
        removeAccount,
      }}
    >
      {children}
    </ChatwootContext.Provider>
  );
}

export function useChatwoot() {
  const context = useContext(ChatwootContext);
  if (context === undefined) {
    throw new Error('useChatwoot deve ser usado dentro de um ChatwootProvider');
  }
  return context;
} 