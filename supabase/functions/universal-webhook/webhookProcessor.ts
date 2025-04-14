import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { LogzzWebhook } from './types.ts'
import { processOrder } from './orderProcessor.ts'

export const processLogzzWebhook = async (
  supabase: any,
  webhookPath: string,
  payload: LogzzWebhook
) => {
  try {
    console.log('Processing webhook with payload:', JSON.stringify(payload, null, 2));
    
    // Extract account_id from webhookPath
    const pathParts = webhookPath?.split('/') || [];
    console.log('Webhook path parts:', pathParts);
    const accountId = pathParts[2]; // Gets the ID from /logzz/{account_id}/...
    
    if (!accountId) {
      throw new Error('Invalid webhook path - missing account ID');
    }
    
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload received');
    }

    console.log('Extracted account ID:', accountId);
    
    const timestamp = new Date().toISOString();

    // Update webhook status to active if it's the first successful processing
    const { error: webhookUpdateError } = await supabase
      .from('account_webhooks')
      .update({ 
        status: 'ativo',
        activated_at: timestamp,
        last_received_payload: payload
      })
      .eq('webhook_url', webhookPath)
      .eq('status', 'pendente');

    if (webhookUpdateError) {
      console.error('Error updating webhook status:', webhookUpdateError);
      throw webhookUpdateError;
    }

    return await processOrder(supabase, accountId, payload, timestamp);
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Error details:', error.message);
    if (error.details) console.error('Additional details:', error.details);

    // Ensure we have a valid error object for logging
    const errorMessage = error.message || 'Unknown error occurred';
    const errorDetails = error.details || {};

    await supabase
      .from('webhook_errors')
      .insert({
        error_message: errorMessage,
        payload: payload || {},
        error_details: errorDetails
      });

    throw error;
  }
};