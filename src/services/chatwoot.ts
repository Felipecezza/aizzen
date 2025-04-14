import { supabase } from '@/lib/supabase';

const CHATWOOT_API_URL = 'https://chat.aizzen.com.br/api/v1';
const CHATWOOT_PLATFORM_API_URL = 'https://chat.aizzen.com.br/platform/api/v1';

interface ChatwootAccount {
  id: number;
  name: string;
  website_token: string;
}

interface ChatwootInbox {
  id: number;
  name: string;
  website_token: string;
  channel_type: string;
  avatar_url: string;
  widget_color: string;
  website_url: string;
  welcome_title: string;
  welcome_tagline: string;
  greeting_enabled: boolean;
  greeting_message: string;
}

interface ChatwootUser {
  id: number;
  uid: string;
  name: string;
  email: string;
  account_id: number;
  role: string;
  confirmed: boolean;
}

export class ChatwootService {
  private static instance: ChatwootService;
  private accessToken: string;

  private constructor() {
    // Aqui você deve configurar seu Access Token do Chatwoot
    this.accessToken = import.meta.env.VITE_CHATWOOT_ACCESS_TOKEN || '';
  }

  public static getInstance(): ChatwootService {
    if (!ChatwootService.instance) {
      ChatwootService.instance = new ChatwootService();
    }
    return ChatwootService.instance;
  }

  // Método para criar toda a estrutura do Chatwoot para um novo usuário
  async createChatwootStructure(userId: string, userName: string, userEmail: string): Promise<{
    account: ChatwootAccount;
    user: ChatwootUser;
    inbox: ChatwootInbox;
  }> {
    try {
      // 1. Criar conta no Chatwoot
      const account = await this.createAccount(`Chat ${userName}`);
      
      // 2. Criar usuário no Chatwoot
      const user = await this.createUser(
        account.id,
        userName,
        userEmail,
        Math.random().toString(36).slice(-8) // Senha aleatória
      );

      // 3. Adicionar usuário à conta como administrador
      await this.addUserToAccount(account.id, user.id);
      
      // 4. Criar inbox para a conta
      const inbox = await this.createInbox(account.id, `Inbox ${userName}`);
      
      // 5. Salvar no Supabase
      await this.saveChatwootAccount(
        userId,
        account.id,
        inbox.id,
        inbox.website_token
      );

      return { account, user, inbox };
    } catch (error) {
      console.error('Erro ao criar estrutura do Chatwoot:', error);
      throw error;
    }
  }

  // Criar uma nova conta no Chatwoot
  async createAccount(name: string): Promise<ChatwootAccount> {
    const response = await fetch(`${CHATWOOT_PLATFORM_API_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': this.accessToken,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar conta no Chatwoot: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  // Criar um novo usuário no Chatwoot
  async createUser(accountId: number, name: string, email: string, password: string): Promise<ChatwootUser> {
    const response = await fetch(`${CHATWOOT_PLATFORM_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': this.accessToken,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        account_id: accountId,
        role: 'agent', // Define o usuário como agente
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar usuário no Chatwoot: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  // Adicionar usuário à conta como administrador
  async addUserToAccount(accountId: number, userId: number): Promise<void> {
    const response = await fetch(`${CHATWOOT_PLATFORM_API_URL}/accounts/${accountId}/account_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': this.accessToken,
      },
      body: JSON.stringify({
        user_id: userId,
        role: 'administrator',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao adicionar usuário à conta: ${JSON.stringify(error)}`);
    }
  }

  // Criar um novo inbox (widget) para a conta
  async createInbox(accountId: number, name: string): Promise<ChatwootInbox> {
    const response = await fetch(`${CHATWOOT_API_URL}/accounts/${accountId}/inboxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': this.accessToken,
      },
      body: JSON.stringify({
        name,
        channel: {
          type: 'web_widget',
          website_url: window.location.origin,
          welcome_title: 'Bem-vindo ao suporte da Aizzen!',
          welcome_tagline: 'Como podemos ajudar você hoje?',
          agent_away_message: 'Nossa equipe está offline no momento. Deixe sua mensagem e responderemos assim que possível.',
          widget_color: '#1f93ff',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar inbox no Chatwoot: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  // Salvar as informações da conta no Supabase
  async saveChatwootAccount(userId: string, accountId: number, inboxId: number, websiteToken: string) {
    const { error } = await supabase
      .from('chatwoot_accounts')
      .insert({
        user_id: userId,
        account_id: accountId,
        inbox_id: inboxId,
        website_token: websiteToken,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error('Erro ao salvar conta do Chatwoot no banco de dados');
    }
  }

  // Buscar contas do Chatwoot de um usuário
  async getUserChatwootAccounts(userId: string) {
    const { data, error } = await supabase
      .from('chatwoot_accounts')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error('Erro ao buscar contas do Chatwoot');
    }

    return data;
  }
} 