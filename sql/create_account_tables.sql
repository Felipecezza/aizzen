-- Criar tabela de contas
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para relacionamento entre contas e usuários
CREATE TABLE account_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(account_id, user_id)
);

-- Adicionar campo account_id às tabelas existentes
ALTER TABLE whatsapp_connections 
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_account_id 
ON whatsapp_connections(account_id);

CREATE INDEX IF NOT EXISTS idx_account_users_user_id 
ON account_users(user_id);

CREATE INDEX IF NOT EXISTS idx_account_users_account_id 
ON account_users(account_id);

-- Preencher o campo account_id nas conexões existentes
-- (esta parte deve ser executada após criar as contas e associar usuários)
UPDATE whatsapp_connections wc
SET account_id = au.account_id
FROM account_users au
WHERE wc.user_id = au.user_id
AND wc.account_id IS NULL; 