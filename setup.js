const { exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para executar comandos de terminal
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\nExecutando: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Função principal de configuração
async function setup() {
  console.log('===== Setup da Aplicação Aizzen V3 =====');
  console.log('Este script irá configurar o ambiente completo');
  
  try {
    // 1. Instalação de dependências
    console.log('\n--- Instalando dependências do projeto ---');
    await runCommand('npm install');
    
    // 2. Configuração do Supabase
    console.log('\n--- Configuração do Supabase ---');
    rl.question('Você deseja configurar o banco de dados Supabase? (s/n): ', async (answer) => {
      if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
        rl.question('Digite a chave service_role do seu Supabase: ', async (key) => {
          if (key) {
            // Substituir a chave no arquivo apply_schema.js
            try {
              let content = fs.readFileSync('./apply_schema.js', 'utf8');
              content = content.replace(/<SERVICE_KEY>/, key);
              fs.writeFileSync('./apply_schema.js', content);
              
              console.log('\nExecutando script para criar tabelas no Supabase...');
              await runCommand('node apply_schema.js');
              
              console.log('\nExecutando verificação das tabelas criadas...');
              let execContent = fs.readFileSync('./execute_sql.js', 'utf8');
              execContent = execContent.replace(/<SERVICE_KEY>/, key);
              fs.writeFileSync('./execute_sql.js', execContent);
              await runCommand('node execute_sql.js');
            } catch (error) {
              console.error('Erro ao configurar Supabase:', error);
            }
          } else {
            console.log('Nenhuma chave fornecida. Pulando configuração do Supabase.');
          }
          
          // 3. Iniciar o servidor de desenvolvimento
          console.log('\n--- Iniciando o servidor de desenvolvimento ---');
          console.log('Servidor de desenvolvimento iniciado em http://localhost:8080');
          console.log('Pressione Ctrl+C para encerrar');
          
          rl.close();
          await runCommand('npm run dev');
        });
      } else {
        // Pular configuração do Supabase
        console.log('Configuração do Supabase ignorada.');
        
        // Iniciar o servidor de desenvolvimento
        console.log('\n--- Iniciando o servidor de desenvolvimento ---');
        console.log('Servidor de desenvolvimento iniciado em http://localhost:8080');
        console.log('Pressione Ctrl+C para encerrar');
        
        rl.close();
        await runCommand('npm run dev');
      }
    });
  } catch (error) {
    console.error('\nErro durante o setup:', error);
    rl.close();
  }
}

// Executar função de setup
setup(); 