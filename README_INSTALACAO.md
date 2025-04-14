# Instruções de Instalação Aizzen v3 via Portainer

Este guia descreve como instalar a aplicação Aizzen v3 utilizando o Portainer.

## Pré-requisitos

- Docker instalado no servidor
- Portainer já configurado e acessível
- Seu domínio configurado para apontar para o IP do servidor

## Instalação pelo Portainer

### 1. Preparação dos arquivos

1. Faça upload de todos os arquivos do projeto para o servidor, incluindo:
   - Dockerfile
   - nginx.conf
   - docker-compose.yml
   - Todo o código fonte

### 2. Utilizando a UI do Portainer

1. Acesse o Portainer no seu navegador (geralmente http://seu-servidor:9000)
2. Faça login com suas credenciais
3. Selecione o ambiente onde deseja implantar (geralmente "local")
4. No menu lateral, clique em "Stacks"
5. Clique em "Add stack"
6. Dê um nome ao stack, como "aizzen-v3"

#### Opção 1: Upload Web Editor
7. No "Web editor", você pode colar o conteúdo do arquivo docker-compose.yml
8. Clique em "Deploy the stack"

#### Opção 2: Upload do arquivo
7. Escolha a opção "Upload" e selecione o arquivo docker-compose.yml
8. Clique em "Deploy the stack"

#### Opção 3: Repositório Git
7. Se seu código estiver em um repositório Git, escolha a opção "Repository"
8. Insira a URL do repositório e credenciais se necessário
9. Especifique o caminho para o arquivo docker-compose.yml
10. Clique em "Deploy the stack"

### 3. Configurando seu domínio

Após a instalação, você pode configurar seu domínio personalizado para apontar para o aplicativo:

1. No DNS do seu domínio, crie um registro A apontando para o IP do seu servidor
2. Se desejar usar HTTPS, você pode:
   - Configurar um proxy reverso como Traefik ou Nginx Proxy Manager no Portainer
   - Usar Cloudflare como proxy para obter HTTPS

## Verificação da instalação

1. Acesse o URL do seu domínio no navegador
2. A aplicação Aizzen v3 deve estar funcionando
3. Verifique os logs no Portainer se houver problemas, em Stacks > aizzen-v3

## Manutenção e atualizações

Para atualizar a aplicação no futuro:

1. Faça as alterações no código
2. Atualize os arquivos no servidor
3. No Portainer, vá até Stacks > aizzen-v3
4. Clique em "Editor"
5. Se necessário, modifique o docker-compose.yml
6. Clique em "Update the stack"

## Suporte

Se encontrar problemas durante a instalação, verifique:

1. Logs do contêiner no Portainer
2. Configuração de rede no Docker
3. Configurações de DNS para seu domínio

Para suporte adicional, entre em contato com suporte@aizzen.com.br 