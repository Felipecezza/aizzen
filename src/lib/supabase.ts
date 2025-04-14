import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase.config';

// Uso da configuração direta em vez de variáveis de ambiente
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

console.log('URL do Supabase (config):', supabaseUrl);
console.log('Chave do Supabase (config): [CHAVE PRESENTE]');

// Criando uma única instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'aizzen-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Exportando uma função para garantir que sempre usamos a mesma instância
export const getSupabaseClient = () => supabase;