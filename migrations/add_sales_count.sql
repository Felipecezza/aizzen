-- Adicionar coluna de contagem de vendas à tabela account_plans, se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'account_plans' 
        AND column_name = 'sales_count'
    ) THEN
        ALTER TABLE public.account_plans 
        ADD COLUMN sales_count INTEGER NOT NULL DEFAULT 0;
        
        RAISE NOTICE 'Coluna sales_count adicionada à tabela account_plans';
    ELSE
        RAISE NOTICE 'Coluna sales_count já existe na tabela account_plans';
    END IF;
END $$; 