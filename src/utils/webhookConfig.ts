/**
 * Configuração centralizada para endpoints de webhook
 */

// URL base do servidor de webhook
const BASE_URL = 'https://webhook.aizzen.com.br/webhook';

export const WEBHOOK_ENDPOINTS = {
  // Endpoint para criar uma nova instância WhatsApp
  CRIAR_INSTANCIA: `${BASE_URL}/criar-instancia-evolution`,
  
  // Endpoint para atualizar o QR code de uma instância existente
  ATUALIZAR_QR_CODE: `${BASE_URL}/atualizar-qr-code`,
  
  // Endpoint para verificar o status de conexão de uma instância
  VERIFICAR_CONEXAO: `${BASE_URL}/verifica-conexao`,
  
  // Endpoint para deletar uma instância
  DELETAR_INSTANCIA: `${BASE_URL}/exclui-conexao`,
  
  // Endpoint para conectar um agente
  CONECTAR_AGENTE: `${BASE_URL}/conecta-agente`
};

// Exporta os endpoints como webhookApi para compatibilidade com o código existente
export const webhookApi = WEBHOOK_ENDPOINTS;

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json, image/png, text/plain, */*'
};

/**
 * Função auxiliar para fazer requisições para os webhooks
 * @param url URL do endpoint
 * @param data Dados a serem enviados
 * @returns Resposta da requisição
 */
export const callWebhook = async (url: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorText = await response.text();
        errorDetails = errorText;
        console.error('Erro na resposta do webhook:', errorText);
      } catch (readError) {
        console.error('Não foi possível ler detalhes do erro:', readError);
      }
      
      throw new Error(`Falha na requisição: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`);
    }
    
    return response;
  } catch (error) {
    console.error('Erro ao chamar webhook:', error);
    throw error;
  }
}; 