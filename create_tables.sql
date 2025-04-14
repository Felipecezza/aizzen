-- Enum types
DO $$ BEGIN
    CREATE TYPE public.plan_type AS ENUM ('free', 'basic', 'premium', 'enterprise');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status_type AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'canceled', 'refunded');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.integration_type AS ENUM ('logzz', 'tiktok', 'facebook', 'chatwoot', 'agent');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- PERFIS DE USUÁRIO (caso não exista)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
            full_name TEXT,
            phone TEXT,
            cpf TEXT,
            birth_date DATE,
            avatar_url TEXT,
            address JSONB DEFAULT '{}'::JSONB,
            email TEXT,
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view their own profile"
            ON public.profiles FOR SELECT
            USING (auth.uid() = id);

        CREATE POLICY "Users can update their own profile"
            ON public.profiles FOR UPDATE
            USING (auth.uid() = id);

        CREATE POLICY "Users can insert their own profile"
            ON public.profiles FOR INSERT
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- PLANOS DE CONTA
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'account_plans') THEN
        CREATE TABLE public.account_plans (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            plan_type plan_type NOT NULL DEFAULT 'free',
            messages_limit INTEGER NOT NULL DEFAULT 100,
            current_usage INTEGER NOT NULL DEFAULT 0,
            start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.account_plans ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem ver seus próprios planos"
            ON public.account_plans FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Apenas super admin pode inserir/atualizar planos"
            ON public.account_plans FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM auth.users
                    WHERE auth.uid() = auth.users.id AND auth.users.email = 'admin@aizzen.com.br'
                )
            );
    END IF;
END $$;

-- PRODUTOS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        CREATE TABLE public.products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
            name TEXT NOT NULL,
            image_url TEXT,
            revenue DECIMAL(10, 2) DEFAULT 0,
            pending DECIMAL(10, 2) DEFAULT 0,
            product_cost DECIMAL(10, 2) DEFAULT 0,
            marketing DECIMAL(10, 2) DEFAULT 0,
            cpa DECIMAL(10, 2) DEFAULT 0,
            delivery_performance DECIMAL(10, 2) DEFAULT 0,
            net_profit DECIMAL(10, 2) DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem gerenciar seus próprios produtos"
            ON public.products FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- PEDIDOS LOGZZ
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'logzz_orders') THEN
        CREATE TABLE public.logzz_orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_number TEXT NOT NULL UNIQUE,
            account_id TEXT,
            client_name TEXT,
            client_email TEXT,
            client_documment TEXT, -- Mantido com a grafia original
            client_phone TEXT,
            client_zip_code TEXT,
            client_address TEXT,
            client_address_number TEXT,
            client_address_district TEXT,
            client_address_comp TEXT,
            client_address_city TEXT,
            client_address_state TEXT,
            client_address_country TEXT,
            date_order TEXT,
            date_order_day TEXT,
            date_delivery TEXT,
            date_delivery_day TEXT,
            delivery_estimate TEXT,
            order_status_description TEXT,
            order_quantity INTEGER,
            order_final_price DECIMAL(10, 2),
            second_order BOOLEAN,
            first_order BOOLEAN,
            logistic_operator TEXT,
            delivery_man TEXT,
            delivery_man_phone TEXT,
            producer_name TEXT,
            producer_email TEXT,
            affiliate_name TEXT,
            affiliate_email TEXT,
            utm_source TEXT,
            utm_medium TEXT,
            utm_campaign TEXT,
            utm_term TEXT,
            utm_content TEXT,
            utm_id TEXT,
            products JSONB,
            status order_status_type,
            commission DECIMAL(10, 2),
            loss_amount DECIMAL(10, 2),
            last_updated TIMESTAMP WITH TIME ZONE,
            webhook_last_update TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices para melhorar performance de consultas
        CREATE INDEX logzz_orders_account_id_idx ON public.logzz_orders(account_id);
        CREATE INDEX logzz_orders_client_name_idx ON public.logzz_orders(client_name);
        CREATE INDEX logzz_orders_status_idx ON public.logzz_orders(status);
        CREATE INDEX logzz_orders_created_at_idx ON public.logzz_orders(created_at);

        -- Habilitar RLS
        ALTER TABLE public.logzz_orders ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- INTEGRAÇÕES E WEBHOOKS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'webhooks') THEN
        CREATE TABLE public.webhooks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            integration_type integration_type NOT NULL,
            webhook_url TEXT NOT NULL,
            account_id TEXT,
            account_name TEXT,
            status TEXT DEFAULT 'active',
            metadata JSONB,
            last_used_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem gerenciar seus próprios webhooks"
            ON public.webhooks FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- CONEXÕES WHATSAPP
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'whatsapp_connections') THEN
        CREATE TABLE public.whatsapp_connections (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            instance_name TEXT NOT NULL,
            phone_number TEXT,
            status TEXT DEFAULT 'pending',
            qr_code TEXT,
            api_token TEXT,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.whatsapp_connections ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem gerenciar suas próprias conexões"
            ON public.whatsapp_connections FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- MÉTRICAS DE AGENTES E CHAT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chatwoot_metrics') THEN
        CREATE TABLE public.chatwoot_metrics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            date DATE NOT NULL,
            messages_received INTEGER DEFAULT 0,
            messages_sent INTEGER DEFAULT 0,
            agent_metrics JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Habilitar RLS
        ALTER TABLE public.chatwoot_metrics ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem ver suas próprias métricas"
            ON public.chatwoot_metrics FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- INTEGRAÇÃO COM FACEBOOK
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'facebook_ad_accounts') THEN
        CREATE TABLE public.facebook_ad_accounts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            account_id TEXT NOT NULL,
            access_token TEXT NOT NULL,
            account_name TEXT,
            status TEXT DEFAULT 'active',
            last_sync_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.facebook_ad_accounts ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem gerenciar suas próprias contas do Facebook"
            ON public.facebook_ad_accounts FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- INTEGRAÇÃO COM TIKTOK
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tiktok_ad_accounts') THEN
        CREATE TABLE public.tiktok_ad_accounts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            advertiser_id TEXT NOT NULL,
            access_token TEXT NOT NULL,
            advertiser_name TEXT,
            status TEXT DEFAULT 'active',
            last_sync_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.tiktok_ad_accounts ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem gerenciar suas próprias contas do TikTok"
            ON public.tiktok_ad_accounts FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- CONFIGURAÇÃO CHATWOOT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chatwoot_configs') THEN
        CREATE TABLE public.chatwoot_configs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            api_url TEXT NOT NULL,
            account_id TEXT NOT NULL,
            access_token TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Habilitar RLS
        ALTER TABLE public.chatwoot_configs ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Usuários podem gerenciar suas próprias configurações Chatwoot"
            ON public.chatwoot_configs FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- TRIGGERS PARA ATUALIZAR A COLUNA UPDATED_AT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    END IF;
END $$;

-- Aplicar o trigger em todas as tabelas que possuem a coluna updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_account_plans_updated_at') THEN
        CREATE TRIGGER update_account_plans_updated_at
        BEFORE UPDATE ON public.account_plans
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
        CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON public.products
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_webhooks_updated_at') THEN
        CREATE TRIGGER update_webhooks_updated_at
        BEFORE UPDATE ON public.webhooks
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_whatsapp_connections_updated_at') THEN
        CREATE TRIGGER update_whatsapp_connections_updated_at
        BEFORE UPDATE ON public.whatsapp_connections
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_facebook_ad_accounts_updated_at') THEN
        CREATE TRIGGER update_facebook_ad_accounts_updated_at
        BEFORE UPDATE ON public.facebook_ad_accounts
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_tiktok_ad_accounts_updated_at') THEN
        CREATE TRIGGER update_tiktok_ad_accounts_updated_at
        BEFORE UPDATE ON public.tiktok_ad_accounts
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_chatwoot_configs_updated_at') THEN
        CREATE TRIGGER update_chatwoot_configs_updated_at
        BEFORE UPDATE ON public.chatwoot_configs
        FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
    END IF;
END $$;

-- TRIGGER PARA CRIAR PLANO GRÁTIS QUANDO UM NOVO USUÁRIO SE REGISTRA
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'create_default_account_plan') THEN
        CREATE OR REPLACE FUNCTION public.create_default_account_plan()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.account_plans (user_id, plan_type, messages_limit)
            VALUES (NEW.id, 'free', 100);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_user_created_add_default_plan') THEN
        CREATE TRIGGER on_user_created_add_default_plan
        AFTER INSERT ON public.profiles
        FOR EACH ROW EXECUTE PROCEDURE public.create_default_account_plan();
    END IF;
END $$;

-- TRIGGER PARA CRIAR PERFIL QUANDO UM NOVO USUÁRIO SE REGISTRA
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') THEN
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id)
            VALUES (NEW.id);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    END IF;
END $$;

-- POLÍTICAS RLS PARA PEDIDOS LOGZZ
DO $$ 
BEGIN
    -- Apaga as políticas existentes para recriar
    DROP POLICY IF EXISTS "Usuários só podem ver pedidos da própria conta" ON public.logzz_orders;
    DROP POLICY IF EXISTS "Usuários só podem modificar pedidos da própria conta" ON public.logzz_orders;
    
    -- Recria as políticas
    CREATE POLICY "Usuários só podem ver pedidos da própria conta"
        ON public.logzz_orders FOR SELECT
        USING (
            account_id IN (
                SELECT w.account_id FROM public.webhooks w
                WHERE w.user_id = auth.uid() AND w.integration_type = 'logzz'
            )
        );

    CREATE POLICY "Usuários só podem modificar pedidos da própria conta"
        ON public.logzz_orders FOR ALL
        USING (
            account_id IN (
                SELECT w.account_id FROM public.webhooks w
                WHERE w.user_id = auth.uid() AND w.integration_type = 'logzz'
            )
        );
END $$; 