-- Verificar se a tabela accounts existe, se não, criar
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Verificar se a tabela account_users existe, se não, criar
CREATE TABLE IF NOT EXISTS account_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(account_id, user_id)
);

-- Adicionar campo account_id à tabela whatsapp_connections
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_connections' AND column_name = 'account_id'
    ) THEN
        ALTER TABLE whatsapp_connections ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_account_id ON whatsapp_connections(account_id);
    END IF;
END
$$;

-- Adicionar campo account_id à tabela system_agents (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'system_agents'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'system_agents' AND column_name = 'account_id'
    ) THEN
        ALTER TABLE system_agents ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_system_agents_account_id ON system_agents(account_id);
    END IF;
END
$$;

-- Adicionar campo account_id à tabela user_agents (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_agents'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_agents' AND column_name = 'account_id'
    ) THEN
        ALTER TABLE user_agents ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_user_agents_account_id ON user_agents(account_id);
    END IF;
END
$$;

-- Criar uma função para criar automaticamente uma conta para cada usuário
CREATE OR REPLACE FUNCTION create_account_for_user()
RETURNS TRIGGER AS $$
DECLARE
    account_id UUID;
BEGIN
    -- Criar uma nova conta para o usuário
    INSERT INTO accounts (name)
    VALUES (NEW.email)
    RETURNING id INTO account_id;
    
    -- Associar o usuário à conta como proprietário
    INSERT INTO account_users (account_id, user_id, role)
    VALUES (account_id, NEW.id, 'owner');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verificar se o trigger existe e criar se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'create_account_for_new_users'
    ) THEN
        CREATE TRIGGER create_account_for_new_users
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION create_account_for_user();
    END IF;
END
$$; 