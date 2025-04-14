import { LogzzWebhook } from './types.ts';
import { formatDateTime, formatOrderStatus, formatProducts } from './formatters.ts';

export const processOrder = async (
  supabase: any,
  accountId: string,
  payload: LogzzWebhook,
  timestamp: string
) => {
  try {
    console.log('Processing order for account:', accountId);
    console.log('Order payload:', JSON.stringify(payload, null, 2));

    // Check if order already exists
    const { data: existingOrder, error: fetchError } = await supabase
      .from('logzz_orders')
      .select('*')
      .eq('order_number', payload.order_number)
      .eq('account_id', accountId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing order:', fetchError);
      throw fetchError;
    }

    // Format products before saving
    const formattedProducts = formatProducts(payload.products);
    console.log('Formatted products:', formattedProducts);

    const orderData = {
      account_id: accountId,
      order_number: payload.order_number,
      client_name: payload.client_name,
      client_email: payload.client_email,
      client_documment: payload.client_document, // Note: field name differs in payload
      client_phone: payload.client_phone,
      client_zip_code: payload.client_zip_code,
      client_address: payload.client_address,
      client_address_number: payload.client_address_number,
      client_address_district: payload.client_address_district,
      client_address_comp: payload.client_address_comp,
      client_address_city: payload.client_address_city,
      client_address_state: payload.client_address_state,
      client_address_country: payload.client_address_country,
      date_order: formatDateTime(payload.date_order),
      date_order_day: payload.date_order_day,
      date_delivery: formatDateTime(payload.date_delivery),
      date_delivery_day: payload.date_delivery_day,
      delivery_estimate: formatDateTime(payload.delivery_estimate),
      order_quantity: parseInt(String(payload.order_quantity) || '0'),
      order_final_price: parseFloat(String(payload.order_final_price) || '0'),
      second_order: payload.second_order,
      first_order: payload.first_order,
      logistic_operator: payload.logistic_operator,
      delivery_man: payload.delivery_man,
      producer_name: payload.producer_name,
      producer_email: payload.producer_email,
      affiliate_name: payload.affiliate_name,
      affiliate_email: payload.affiliate_email,
      products: formattedProducts,
      commission: parseFloat(String(payload.commission) || '0'),
      status: formatOrderStatus(payload.order_status),
      order_status_description: payload.order_status_description,
      webhook_last_update: timestamp
    };

    console.log('Prepared order data:', JSON.stringify(orderData, null, 2));

    let result;
    if (existingOrder) {
      console.log('Updating existing order:', existingOrder.order_number);
      const { data, error: updateError } = await supabase
        .from('logzz_orders')
        .update(orderData)
        .eq('order_number', payload.order_number)
        .eq('account_id', accountId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating order:', updateError);
        throw updateError;
      }
      result = data;
    } else {
      console.log('Creating new order');
      const { data, error: insertError } = await supabase
        .from('logzz_orders')
        .insert(orderData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting order:', insertError);
        throw insertError;
      }
      result = data;
    }

    // Log order status change
    if (existingOrder?.status !== orderData.status) {
      const { error: logError } = await supabase
        .from('order_status_logs')
        .insert({
          order_number: payload.order_number,
          account_id: accountId,
          previous_status: existingOrder?.status || null,
          new_status: orderData.status,
        });

      if (logError) {
        console.error('Error logging status change:', logError);
      }
    }

    return result;
  } catch (error) {
    console.error('Error in processOrder:', error);
    throw error;
  }
};