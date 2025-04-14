
import type { Json } from './shared';

export interface Tables {
  profiles: {
    Row: {
      id: string;
      full_name: string | null;
      phone: string | null;
      cpf: string | null;
      birth_date: string | null;
      avatar_url: string | null;
      address: Json | null;
      updated_at: string | null;
      email: string | null;
    };
    Insert: {
      id: string;
      full_name?: string | null;
      phone?: string | null;
      cpf?: string | null;
      birth_date?: string | null;
      avatar_url?: string | null;
      address?: Json | null;
      updated_at?: string | null;
      email?: string | null;
    };
    Update: {
      id?: string;
      full_name?: string | null;
      phone?: string | null;
      cpf?: string | null;
      birth_date?: string | null;
      avatar_url?: string | null;
      address?: Json | null;
      updated_at?: string | null;
      email?: string | null;
    };
  };
  facebook_ad_accounts: {
    Row: {
      id: string;
      user_id: string;
      account_id: string;
      access_token: string;
      account_name: string | null;
      status: string;
      created_at: string;
      updated_at: string;
      last_sync_at: string | null;
    };
    Insert: {
      id?: string;
      user_id?: string;
      account_id: string;
      access_token: string;
      account_name?: string | null;
      status?: string;
      created_at?: string;
      updated_at?: string;
      last_sync_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      account_id?: string;
      access_token?: string;
      account_name?: string | null;
      status?: string;
      created_at?: string;
      updated_at?: string;
      last_sync_at?: string | null;
    };
  };
  facebook_campaigns: {
    Row: {
      id: string;
      ad_account_id: string;
      campaign_id: string;
      name: string;
      status: string | null;
      daily_budget: number | null;
      lifetime_budget: number | null;
      start_time: string | null;
      end_time: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      ad_account_id: string;
      campaign_id: string;
      name: string;
      status?: string | null;
      daily_budget?: number | null;
      lifetime_budget?: number | null;
      start_time?: string | null;
      end_time?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      ad_account_id?: string;
      campaign_id?: string;
      name?: string;
      status?: string | null;
      daily_budget?: number | null;
      lifetime_budget?: number | null;
      start_time?: string | null;
      end_time?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
  tiktok_ad_accounts: {
    Row: {
      id: string;
      user_id: string;
      advertiser_id: string;
      access_token: string;
      advertiser_name: string | null;
      status: string;
      created_at: string;
      updated_at: string;
      last_sync_at: string | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      advertiser_id: string;
      access_token: string;
      advertiser_name?: string | null;
      status?: string;
      created_at?: string;
      updated_at?: string;
      last_sync_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      advertiser_id?: string;
      access_token?: string;
      advertiser_name?: string | null;
      status?: string;
      created_at?: string;
      updated_at?: string;
      last_sync_at?: string | null;
    };
  };
  products: {
    Row: {
      id: string;
      name: string;
      image_url: string | null;
      revenue: number;
      pending: number;
      product_cost: number;
      marketing: number;
      cpa: number;
      delivery_performance: number;
      net_profit: number;
      user_id: string | null;
      created_at: string | null;
      updated_at: string | null;
      is_active: boolean | null;
    };
    Insert: {
      id?: string;
      name: string;
      image_url?: string | null;
      revenue?: number;
      pending?: number;
      product_cost?: number;
      marketing?: number;
      cpa?: number;
      delivery_performance?: number;
      net_profit?: number;
      user_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      is_active?: boolean | null;
    };
    Update: {
      id?: string;
      name?: string;
      image_url?: string | null;
      revenue?: number;
      pending?: number;
      product_cost?: number;
      marketing?: number;
      cpa?: number;
      delivery_performance?: number;
      net_profit?: number;
      user_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      is_active?: boolean | null;
    };
  };
  orders: {
    Row: {
      id: string;
      product_id: string;
      client_name: string;
      value: number;
      status: string;
      scheduled_date: string | null;
      created_at: string | null;
      updated_at: string | null;
      user_id: string | null;
      customer_data: Json | null;
    };
    Insert: {
      id?: string;
      product_id: string;
      client_name: string;
      value?: number;
      status: string;
      scheduled_date?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      user_id?: string | null;
      customer_data?: Json | null;
    };
    Update: {
      id?: string;
      product_id?: string;
      client_name?: string;
      value?: number;
      status?: string;
      scheduled_date?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      user_id?: string | null;
      customer_data?: Json | null;
    };
  };
  webhooks: {
    Row: {
      id: string;
      user_id: string;
      integration_type: "facebook_ads" | "tiktok_ads";
      webhook_url: string;
      account_name: string | null;
      account_id: string | null;
      status: string | null;
      metadata: Json | null;
      created_at: string | null;
      updated_at: string | null;
      last_used_at: string | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      integration_type: "facebook_ads" | "tiktok_ads";
      webhook_url: string;
      account_name?: string | null;
      account_id?: string | null;
      status?: string | null;
      metadata?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
      last_used_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      integration_type?: "facebook_ads" | "tiktok_ads";
      webhook_url?: string;
      account_name?: string | null;
      account_id?: string | null;
      status?: string | null;
      metadata?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
      last_used_at?: string | null;
    };
  };
  webhook_events: {
    Row: {
      id: string;
      webhook_id: string;
      event_type: string;
      payload: Json;
      processed_at: string | null;
      status: string | null;
      error_message: string | null;
      metadata: Json | null;
    };
    Insert: {
      id?: string;
      webhook_id: string;
      event_type: string;
      payload: Json;
      processed_at?: string | null;
      status?: string | null;
      error_message?: string | null;
      metadata?: Json | null;
    };
    Update: {
      id?: string;
      webhook_id?: string;
      event_type?: string;
      payload?: Json;
      processed_at?: string | null;
      status?: string | null;
      error_message?: string | null;
      metadata?: Json | null;
    };
  };
  universal_webhook_events: {
    Row: {
      id: string;
      received_at: string | null;
      raw_payload: Json;
      webhook_path: string;
      processed_at: string | null;
      status: string | null;
      error_message: string | null;
      metadata: Json | null;
    };
    Insert: {
      id?: string;
      received_at?: string | null;
      raw_payload: Json;
      webhook_path: string;
      processed_at?: string | null;
      status?: string | null;
      error_message?: string | null;
      metadata?: Json | null;
    };
    Update: {
      id?: string;
      received_at?: string | null;
      raw_payload?: Json;
      webhook_path?: string;
      processed_at?: string | null;
      status?: string | null;
      error_message?: string | null;
      metadata?: Json | null;
    };
  };
  account_webhooks: {
    Row: {
      id: string;
      webhook_url: string;
      account_id: string;
      status: string;
      integration_type: string;
      created_at: string;
      activated_at: string | null;
      last_received_payload: Json | null;
    };
    Insert: {
      id?: string;
      webhook_url: string;
      account_id: string;
      status?: string;
      integration_type: string;
      created_at?: string;
      activated_at?: string | null;
      last_received_payload?: Json | null;
    };
    Update: {
      id?: string;
      webhook_url?: string;
      account_id?: string;
      status?: string;
      integration_type?: string;
      created_at?: string;
      activated_at?: string | null;
      last_received_payload?: Json | null;
    };
  };
}
