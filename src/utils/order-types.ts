// Tipos de pedidos para a integração com a Logzz

export type OrderStatus = "Agendado" | "Reagendado" | "Atrasado" | "Completo" | "Frustrado" | "Cancelado" | 
  "A enviar" | "Enviando" | "Enviado" | "Reembolsado" | "Confirmado" | "Em aberto" | "A reagendar" | 
  "Em separação" | "Em rota" | "A caminho" | "Entregue" | "Separado" | "Em Trânsito";

export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface LogzzOrder {
  id: string;
  order_number: string;
  client_name: string | null;
  client_email: string | null;
  client_documment: string | null; // Note the spelling matches Logzz's API
  client_phone: string | null;
  client_zip_code: string | null;
  client_address: string | null;
  client_address_number: string | null;
  client_address_district: string | null;
  client_address_comp: string | null;
  client_address_city: string | null;
  client_address_state: string | null;
  client_address_country: string | null;
  date_order: string | null;
  date_order_day: string | null;
  date_delivery: string | null;
  date_delivery_day: string | null;
  delivery_estimate: string | null;
  order_status: string | null; // Changed from OrderStatus to allow any string
  order_status_description: string | null;
  order_quantity: number | null;
  order_final_price: number | null;
  second_order: boolean | null;
  first_order: boolean | null;
  logistic_operator: string | null;
  delivery_man: string | null;
  delivery_man_phone: string | null;
  producer_name: string | null;
  producer_email: string | null;
  affiliate_name: string | null;
  affiliate_email: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  utm_id: string | null;
  products: OrderProduct[] | null;
  last_updated: string | null;
  created_at: string | null;
  account_id: string | null;
  commission: number | null;
  loss_amount: number | null;
  status: string | null; // Changed from OrderStatus to allow any string
} 