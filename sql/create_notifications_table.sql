-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notifications_account_id 
ON notifications(account_id);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read 
ON notifications(is_read);

-- Função para criar notificação
CREATE OR REPLACE FUNCTION create_notification(
  p_account_id UUID,
  p_message TEXT,
  p_type VARCHAR DEFAULT 'info',
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (
    account_id, 
    message, 
    type, 
    link, 
    metadata, 
    created_by
  ) VALUES (
    p_account_id, 
    p_message, 
    p_type, 
    p_link, 
    p_metadata, 
    p_created_by
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Função para limpar notificações antigas (mais de 30 dias)
CREATE OR REPLACE FUNCTION cleanup_old_notifications() RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '30 days'
  RETURNING COUNT(*) INTO v_deleted_count;
  
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Gatilho para limitar o número de notificações por conta (manter apenas as 100 mais recentes)
CREATE OR REPLACE FUNCTION limit_notifications_per_account() RETURNS TRIGGER AS $$
BEGIN
  -- Deletar notificações excedentes (mantendo apenas as 100 mais recentes para cada conta)
  DELETE FROM notifications
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY created_at DESC) AS rn
      FROM notifications
      WHERE account_id = NEW.account_id
    ) sub
    WHERE rn > 100
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o gatilho para limitar notificações
CREATE TRIGGER limit_notifications_count
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION limit_notifications_per_account(); 