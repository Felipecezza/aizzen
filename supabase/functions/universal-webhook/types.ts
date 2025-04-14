export interface LogzzWebhook {
  integration?: {
    turn: string | null;
    name: string;
    link: string;
    level: string;
  };
  order_number: string;
  client_name?: string;
  client_email?: string;
  client_document?: string;
  client_phone?: string;
  client_zip_code?: string;
  client_address?: string;
  client_address_number?: string;
  client_address_district?: string;
  client_address_comp?: string;
  client_address_city?: string;
  client_address_state?: string;
  client_address_country?: string;
  date_order?: string;
  date_order_day?: string;
  date_delivery?: string;
  date_delivery_day?: string;
  delivery_estimate?: string;
  order_status?: string;
  order_status_description?: string;
  order_quantity?: number | string;
  order_final_price?: number | string;
  second_order?: boolean;
  first_order?: boolean;
  products?: {
    main: {
      product_name: string;
      product_code: string | null;
      quantity: number;
      variations: Array<{
        product_name: string;
        product_code: string | null;
        quantity: number;
      }>;
    };
  };
  logistic_operator?: string;
  delivery_man?: string;
  producer_name?: string;
  producer_email?: string;
  affiliate_name?: string;
  affiliate_email?: string;
  affiliate_phone?: string;
  commission?: number;
}

export interface FormattedProduct {
  name: string;
  quantity: number;
  price: number;
}