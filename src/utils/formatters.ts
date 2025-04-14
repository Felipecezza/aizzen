import { mapOrderStatus } from './statusMapper';

// Interfaces básicas para os produtos
export interface FormattedProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface LogzzWebhook {
  products: {
    main: {
      product_code?: string;
      product_name: string;
      quantity: number;
      variations?: {
        product_code?: string;
        product_name: string;
        quantity: number;
      }[];
    };
  };
}

// Format date strings into ISO format
export const formatDateTime = (dateString?: string): string | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

// Format products from Logzz webhook format to our internal format
export const formatProducts = (productsData?: LogzzWebhook['products']): FormattedProduct[] => {
  if (!productsData || !productsData.main) return [];
  
  const products: FormattedProduct[] = [];
  
  // Add main product
  products.push({
    id: productsData.main.product_code || productsData.main.product_name,
    name: productsData.main.product_name,
    quantity: productsData.main.quantity,
    price: 0, // Price is not provided in the webhook
  });
  
  // Add variations if any
  if (productsData.main.variations && productsData.main.variations.length > 0) {
    productsData.main.variations.forEach(variation => {
      products.push({
        id: variation.product_code || variation.product_name,
        name: variation.product_name,
        quantity: variation.quantity,
        price: 0,
      });
    });
  }
  
  return products;
};

// Format order status to ensure it matches our allowed values
export const formatOrderStatus = (status?: string): string => {
  if (!status) return 'Em aberto';
  return mapOrderStatus(status);
}; 