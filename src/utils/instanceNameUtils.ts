/**
 * Gera um código único de 6 caracteres alfanuméricos para identificar instâncias
 */
export const generateUniqueCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 6;
  let result = '';
  
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
};

/**
 * Formata o nome da instância no padrão "nome_codigo"
 */
export const formatInstanceName = (name: string, code: string): string => {
  // Remove espaços e caracteres especiais, converte para minúsculas
  const sanitizedName = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 20); // Limita o tamanho
  
  return `${sanitizedName}_${code}`;
};

/**
 * Extrai o nome de exibição a partir do nome completo da instância
 */
export const extractDisplayName = (fullName: string): string => {
  if (!fullName) return 'Sem nome';
  
  // Verifica se o nome segue o padrão com underscore
  const parts = fullName.split('_');
  
  // Se tiver mais de uma parte e a última parte parece ser o código (6 caracteres)
  if (parts.length > 1 && parts[parts.length-1].length === 6) {
    // Remove a última parte (código) e junta o resto
    const displayName = parts.slice(0, -1).join('_');
    // Capitaliza primeira letra de cada palavra
    return displayName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Fallback para casos onde o formato não é o esperado
  return fullName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formata o número de telefone para o formato aceito pelo webhook
 */
export const formatPhoneNumberForWebhook = (phoneNumber: string): string => {
  // Remove qualquer caractere não numérico
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos (com DDD)
  if (digits.length === 11) {
    // Formato padrão para Brasil: DDD + número
    const ddd = digits.substring(0, 2);
    const number = digits.substring(2);
    return `55${ddd}${number}`;
  }
  
  // Se já começa com 55 (código do país), retorna como está
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }
  
  // Fallback: retorna os dígitos como estão
  return digits;
};
