import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://supabase.aizzen.com.br';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '<SERVICE_KEY>';

if (supabaseKey === '<SERVICE_KEY>') {
  console.error('Por favor, defina a variável de ambiente SUPABASE_SERVICE_KEY ou substitua <SERVICE_KEY> pelo seu service_role key');
  process.exit(1);
}

// Criar cliente Supabase com a chave de serviço (service_role) 
// que tem permissões para executar operações PostgreSQL
const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  try {
    // Ler o arquivo SQL
    const sqlScript = fs.readFileSync('./create_tables.sql', 'utf8');
    
    // Dividir o script em declarações separadas usando a delimitação DO
    const statements = sqlScript.split('END $$;');
    
    // Executar cada bloco DO separadamente
    for (const statement of statements) {
      if (statement.trim() === '') continue;
      
      const fullStatement = statement + 'END $$;';
      console.log(`Executando bloco SQL...`);
      
      const { error } = await supabase.rpc('pgexec', { cmd: fullStatement });
      
      if (error) {
        console.error('Erro ao executar SQL:', error);
      } else {
        console.log('Bloco SQL executado com sucesso');
      }
    }
    
    console.log('Schema aplicado com sucesso!');
  } catch (error) {
    console.error('Erro ao aplicar schema:', error);
  }
}

applySchema(); 