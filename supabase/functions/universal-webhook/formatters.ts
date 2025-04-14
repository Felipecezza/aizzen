import { FormattedProduct } from './types.ts';

export const formatDateTime = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  
  // Se já for um timestamp ISO válido, retorna como está
  if (dateStr.includes('T') || dateStr.includes('Z')) {
    return dateStr;
  }

  // Se for apenas horário (HH:mm), adiciona a data atual
  if (dateStr.match(/^\d{2}:\d{2}$/)) {
    const today = new Date().toISOString().split('T')[0];
    return `${today}T${dateStr}:00Z`;
  }

  // Converte formato DD.MM.YYYY HH:mm:ss para timestamp ISO
  if (dateStr.match(/^\d{2}\.\d{2}\.\d{4}/)) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('.');
    const formattedDate = `${year}-${month}-${day}${timePart ? `T${timePart}Z` : ''}`;
    return formattedDate;
  }

  // Tenta converter para timestamp ISO
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    console.error('Error parsing date:', dateStr, e);
  }

  return null;
};

export const formatOrderStatus = (status: string | null | undefined): string | null => {
  if (!status) return null;
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const formatProducts = (products: any): FormattedProduct[] => {
  if (!products) return [];

  // Se products.main existir, processa o formato específico da Logzz
  if (products.main) {
    const formattedProducts = [{
      name: products.main.product_name || 'Produto principal',
      quantity: parseInt(String(products.main.quantity) || '1'),
      price: 0 // A Logzz não envia o preço individual do produto
    }];

    // Adiciona as variações se existirem
    if (Array.isArray(products.main.variations)) {
      products.main.variations.forEach((variation: any) => {
        formattedProducts.push({
          name: variation.product_name || 'Variação sem nome',
          quantity: parseInt(String(variation.quantity) || '1'),
          price: 0
        });
      });
    }

    return formattedProducts;
  }

  // Se for um array, retorna ele formatado
  if (Array.isArray(products)) {
    return products.map(product => ({
      name: product.product_name || product.name || 'Produto sem nome',
      quantity: parseInt(String(product.quantity) || '1'),
      price: parseFloat(String(product.price) || '0')
    }));
  }

  // Se for um objeto único, trata como um produto único
  if (typeof products === 'object') {
    return [{
      name: products.product_name || products.name || 'Produto sem nome',
      quantity: parseInt(String(products.quantity) || '1'),
      price: parseFloat(String(products.price) || '0')
    }];
  }

  return [];
};