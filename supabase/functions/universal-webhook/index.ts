
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { processLogzzWebhook } from './webhookProcessor.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('Webhook request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const webhookPath = url.pathname.replace('/universal-webhook', '');
    
    console.log('Processing webhook request:', {
      path: webhookPath,
      timestamp: new Date().toISOString()
    });
    
    if (!webhookPath.includes('/logzz/')) {
      console.error('Invalid webhook path:', webhookPath);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid webhook path'
        }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Content-Type must be application/json'
        }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const rawBody = await req.text();
    console.log('Raw webhook payload:', rawBody);

    if (!rawBody) {
      console.error('Empty request body received');
      throw new Error('Request body is empty');
    }
    
    const payload = JSON.parse(rawBody);
    console.log('Parsed webhook payload:', JSON.stringify(payload, null, 2));

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables');
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const result = await processLogzzWebhook(supabase, webhookPath, payload);
    console.log('Webhook processing result:', result);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Error details:', error.message);
    if (error.details) console.error('Additional details:', error.details);
    
    // Log error to webhook_errors table
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('webhook_errors')
          .insert({
            error_message: error.message,
            payload: error.payload || {},
            received_at: new Date().toISOString()
          });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to process webhook',
        details: error.message 
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
