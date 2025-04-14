import { FormattedProduct } from './types.ts';

export const formatProducts = (productsData: any): FormattedProduct[] => {
  try {
    console.log('Formatting products data:', JSON.stringify(productsData, null, 2));
    
    if (!productsData) {
      console.log('No products data provided');
      return [];
    }

    const products: FormattedProduct[] = [];

    // Verifica se os produtos estão no formato { main: { ... } }
    if (productsData.main) {
      const mainProduct = productsData.main;
      if (mainProduct.product_name) {
        products.push({
          name: mainProduct.product_name,
          quantity: mainProduct.quantity || 1,
          price: 0 // O preço não vem no payload
        });
      }

      // Adiciona as variações se existirem
      if (Array.isArray(mainProduct.variations)) {
        mainProduct.variations.forEach((variation: any) => {
          if (variation.product_name) {
            products.push({
              name: variation.product_name,
              quantity: variation.quantity || 1,
              price: 0
            });
          }
        });
      }
    }

    console.log('Formatted products:', JSON.stringify(products, null, 2));
    return products;
  } catch (error) {
    console.error('Error formatting products:', error);
    return [];
  }
}