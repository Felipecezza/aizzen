import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received webhook request:', req.url)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Received webhook payload:', JSON.stringify(body, null, 2))

    const event = body.event
    if (!event) {
      throw new Error('No event type provided')
    }

    const timestamp = new Date()
    const date = timestamp.toISOString().split('T')[0]

    // Get webhook path and account ID from URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const agentIndex = pathParts.indexOf('agent')
    
    if (agentIndex === -1) {
      console.error('Invalid webhook URL format - missing "agent" path')
      throw new Error('Invalid webhook URL format')
    }

    const accountIdFromPath = pathParts[agentIndex + 1]
    const webhookPath = pathParts.slice(agentIndex).join('/')
    
    console.log('Processing event:', {
      webhookPath,
      accountIdFromPath,
      event,
      timestamp: timestamp.toISOString()
    })

    // Update webhook status to active
    const { error: webhookError } = await supabaseClient
      .from('account_webhooks')
      .update({
        status: 'ativo',
        activated_at: timestamp.toISOString(),
        last_received_payload: body
      })
      .eq('webhook_url', '/' + webhookPath)
      .eq('integration_type', 'agent')

    if (webhookError) {
      console.error('Error updating webhook status:', webhookError)
      throw webhookError
    }

    // Get existing metrics for the day
    const { data: existingMetrics, error: fetchError } = await supabaseClient
      .from('chatwoot_metrics')
      .select('*')
      .eq('date', date)
      .eq('user_id', accountIdFromPath)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching metrics:', fetchError)
      throw fetchError
    }

    let metricsUpdate = {}
    let shouldUpdate = false

    // Process different event types and update metrics
    switch (event) {
      case 'message_created':
        console.log('Processing message_created event:', body)
        // Verifica se a mensagem é de entrada (incoming)
        const isIncoming = body.message?.message_type === 'incoming'
        console.log('Message type:', body.message?.message_type, 'Is incoming:', isIncoming)
        
        if (isIncoming) {
          const currentCount = existingMetrics?.messages_received || 0
          metricsUpdate = {
            messages_received: currentCount + 1
          }
          shouldUpdate = true
          console.log('Current count:', currentCount, 'New count:', metricsUpdate.messages_received)
        }
        break
        
      case 'conversation_created':
        console.log('Processing conversation_created event:', body)
        const currentMetrics = existingMetrics?.agent_metrics || {}
        const currentTotal = currentMetrics.total_conversations || 0
        const currentActive = currentMetrics.active_conversations || 0
        
        metricsUpdate = {
          agent_metrics: {
            ...currentMetrics,
            total_conversations: currentTotal + 1,
            active_conversations: currentActive + 1
          }
        }
        shouldUpdate = true
        console.log('Current metrics:', currentMetrics, 'Updated metrics:', metricsUpdate)
        break

      default:
        console.log('Unhandled event type:', event)
        break
    }

    // Update or create metrics if needed
    if (shouldUpdate) {
      console.log('Updating metrics with:', metricsUpdate)
      
      if (existingMetrics) {
        const { error: updateError } = await supabaseClient
          .from('chatwoot_metrics')
          .update({
            ...metricsUpdate,
            updated_at: timestamp.toISOString()
          })
          .eq('id', existingMetrics.id)

        if (updateError) {
          console.error('Error updating metrics:', updateError)
          throw updateError
        }
      } else {
        const { error: insertError } = await supabaseClient
          .from('chatwoot_metrics')
          .insert({
            user_id: accountIdFromPath,
            date: date,
            messages_received: metricsUpdate.messages_received || 0,
            messages_sent: 0,
            agent_metrics: metricsUpdate.agent_metrics || {
              total_conversations: 0,
              active_conversations: 0
            }
          })

        if (insertError) {
          console.error('Error inserting metrics:', insertError)
          throw insertError
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    console.error('Error details:', error.message)
    if (error.details) console.error('Additional details:', error.details)
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})