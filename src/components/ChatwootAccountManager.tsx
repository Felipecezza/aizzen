import { useState } from 'react';
import { useChatwoot } from '@/contexts/ChatwootContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Position = 'left' | 'right';

interface NewAccount {
  name: string;
  id: string;
  baseUrl: string;
  position: Position;
  primaryColor: string;
}

export function ChatwootAccountManager() {
  const { accounts, currentAccount, setCurrentAccount, addAccount, removeAccount } = useChatwoot();
  const [newAccount, setNewAccount] = useState<NewAccount>({
    name: '',
    id: '',
    baseUrl: 'https://app.chatwoot.com',
    position: 'right',
    primaryColor: '#1f93ff'
  });

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.id) {
      addAccount(newAccount);
      setNewAccount({
        name: '',
        id: '',
        baseUrl: 'https://app.chatwoot.com',
        position: 'right',
        primaryColor: '#1f93ff'
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Gerenciar Contas Chatwoot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Conta Atual</Label>
          <Select
            value={currentAccount?.id}
            onValueChange={(value) => {
              const account = accounts.find(acc => acc.id === value);
              if (account) setCurrentAccount(account);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma conta" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nova Conta</Label>
          <Input
            placeholder="Nome da Conta"
            value={newAccount.name}
            onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="ID do Website (Website Token)"
            value={newAccount.id}
            onChange={(e) => setNewAccount(prev => ({ ...prev, id: e.target.value }))}
          />
          <Input
            placeholder="URL Base (opcional)"
            value={newAccount.baseUrl}
            onChange={(e) => setNewAccount(prev => ({ ...prev, baseUrl: e.target.value }))}
          />
          <Select
            value={newAccount.position}
            onValueChange={(value) => setNewAccount(prev => ({ ...prev, position: value as Position }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Posição do Widget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="color"
            value={newAccount.primaryColor}
            onChange={(e) => setNewAccount(prev => ({ ...prev, primaryColor: e.target.value }))}
          />
          <Button onClick={handleAddAccount} className="w-full">
            Adicionar Conta
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Contas Configuradas</Label>
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-2 border rounded">
              <span>{account.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeAccount(account.id)}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 