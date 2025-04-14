import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://supabase.aizzen.com.br';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '<SERVICE_KEY>';

if (supabaseKey === '<SERVICE_KEY>') {
  console.error('Por favor, defina a variável de ambiente SUPABASE_SERVICE_KEY ou substitua <SERVICE_KEY> pelo seu service_role key');
  process.exit(1);
}

// Criar cliente Supabase com a chave de serviço (service_role)
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para listar todas as tabelas no esquema public
async function listTables() {
  try {
    const { data, error } = await supabase.rpc('pgexec', { 
      cmd: `
        SELECT 
          table_name, 
          (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `
    });
    
    if (error) {
      console.error('Erro ao listar tabelas:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Tabelas existentes no banco de dados:');
      console.log('-----------------------------------');
      data.forEach(table => {
        console.log(`- ${table.table_name} (${table.column_count} colunas)`);
      });
    } else {
      console.log('Nenhuma tabela encontrada no esquema public');
    }
  } catch (error) {
    console.error('Erro inesperado:', error);
  }
}

// Executar a função
listTables(); 