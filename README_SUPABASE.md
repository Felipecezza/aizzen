# Instruções para Configuração do Supabase

Este documento explica como configurar o banco de dados Supabase para a aplicação Aizzen V3.

## Opção 1: Aplicar Schema via Script JavaScript

1. Substitua `<SERVICE_KEY>` pela sua chave de serviço (service_role key) do Supabase no arquivo `apply_schema.js`:

```javascript
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '<SERVICE_KEY>';
```

2. Execute o script:

```bash
node apply_schema.js
```

Este script irá:
- Conectar-se ao seu Supabase em https://supabase.aizzen.com.br
- Executar cada bloco de SQL do arquivo `create_tables.sql`
- Criar todos os tipos, tabelas, índices, políticas e triggers necessários

## Opção 2: Aplicar Schema via Supabase Studio

1. Acesse o Supabase Studio em https://supabase.aizzen.com.br
2. Faça login com suas credenciais de administrador
3. Vá para a seção "SQL Editor"
4. Copie o conteúdo do arquivo `create_tables.sql`
5. Cole no editor SQL e execute

## Tabelas Criadas

O script irá criar as seguintes tabelas:

1. `profiles` - Perfis de usuários
2. `account_plans` - Planos de conta para usuários
3. `products` - Produtos cadastrados no sistema
4. `logzz_orders` - Pedidos integrados com a Logzz
5. `webhooks` - Configurações de webhooks para integrações
6. `whatsapp_connections` - Conexões WhatsApp
7. `chatwoot_metrics` - Métricas de agentes e chat
8. `facebook_ad_accounts` - Contas de anúncios do Facebook
9. `tiktok_ad_accounts` - Contas de anúncios do TikTok
10. `chatwoot_configs` - Configurações Chatwoot

## Políticas de Segurança (RLS)

Todas as tabelas são protegidas com Row Level Security (RLS) para garantir que usuários só possam acessar seus próprios dados.

## Triggers Automáticos

O script configura vários triggers automáticos:

1. Atualização automática do campo `updated_at` em todas as tabelas
2. Criação automática de perfil quando um novo usuário se registra
3. Criação automática de plano grátis quando um novo perfil é criado

## Verificação

Para verificar se as tabelas foram criadas corretamente, você pode executar:

```bash
node execute_sql.js
```

Este script exibirá todas as tabelas disponíveis no esquema `public` do seu banco de dados Supabase. 