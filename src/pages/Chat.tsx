import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useChatwoot } from '@/contexts/ChatwootContext';
import { ChatwootService } from '@/services/chatwoot';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function Chat() {
  const { user } = useAuth();
  const { currentAccount, setCurrentAccount, addAccount } = useChatwoot();
  const [loading, setLoading] = useState(false);
  const chatwootService = ChatwootService.getInstance();

  useEffect(() => {
    if (user) {
      loadChatwootAccounts();
    }
  }, [user]);

  const loadChatwootAccounts = async () => {
    try {
      const accounts = await chatwootService.getUserChatwootAccounts(user.id);
      accounts.forEach(account => {
        addAccount({
          id: account.website_token,
          name: `Chat ${account.id}`,
          baseUrl: 'https://chat.aizzen.com.br',
          position: 'right',
          primaryColor: '#1f93ff'
        });
      });
    } catch (error) {
      console.error('Erro ao carregar contas do Chatwoot:', error);
      toast.error('Erro ao carregar chats');
    }
  };

  const handleCreateNewChat = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // 1. Criar conta no Chatwoot
      const account = await chatwootService.createAccount(`Chat ${user.user_metadata?.full_name || 'Usuário'}`);
      toast.success('Conta criada com sucesso!');
      
      // 2. Criar usuário no Chatwoot
      const chatwootUser = await chatwootService.createUser(
        account.id,
        user.user_metadata?.full_name || 'Usuário',
        user.email,
        Math.random().toString(36).slice(-8) // Senha aleatória
      );
      toast.success('Usuário criado com sucesso!');

      // 3. Adicionar usuário à conta como administrador
      await chatwootService.addUserToAccount(account.id, chatwootUser.id);
      toast.success('Usuário adicionado à conta com sucesso!');
      
      // 4. Criar inbox para a conta
      const inbox = await chatwootService.createInbox(account.id, `Inbox ${user.user_metadata?.full_name || 'Usuário'}`);
      toast.success('Inbox criado com sucesso!');
      
      // 5. Salvar no Supabase
      await chatwootService.saveChatwootAccount(
        user.id,
        account.id,
        inbox.id,
        inbox.website_token
      );

      // 6. Adicionar ao contexto
      const newAccount = {
        id: inbox.website_token,
        name: `Chat ${account.id}`,
        baseUrl: 'https://chat.aizzen.com.br',
        position: 'right' as const,
        primaryColor: '#1f93ff'
      };

      addAccount(newAccount);
      setCurrentAccount(newAccount);
      
      toast.success('Chat criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar novo chat:', error);
      toast.error('Erro ao criar chat. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat</h1>
        <Button onClick={handleCreateNewChat} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Chat
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 