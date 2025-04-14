export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_plans: {
        Row: {
          created_at: string | null
          current_leads_usage: number
          current_usage: number
          cycle_reset_date: string | null
          id: string
          last_payment_date: string | null
          leads_limit: number
          messages_limit: number
          plan_type: Database["public"]["Enums"]["plan_type"]
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_leads_usage?: number
          current_usage?: number
          cycle_reset_date?: string | null
          id?: string
          last_payment_date?: string | null
          leads_limit?: number
          messages_limit: number
          plan_type?: Database["public"]["Enums"]["plan_type"]
          start_date?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_leads_usage?: number
          current_usage?: number
          cycle_reset_date?: string | null
          id?: string
          last_payment_date?: string | null
          leads_limit?: number
          messages_limit?: number
          plan_type?: Database["public"]["Enums"]["plan_type"]
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      account_webhooks: {
        Row: {
          account_id: string
          activated_at: string | null
          created_at: string | null
          id: string
          integration_type: string
          last_received_payload: Json | null
          status: string
          webhook_url: string
        }
        Insert: {
          account_id: string
          activated_at?: string | null
          created_at?: string | null
          id?: string
          integration_type?: string
          last_received_payload?: Json | null
          status?: string
          webhook_url: string
        }
        Update: {
          account_id?: string
          activated_at?: string | null
          created_at?: string | null
          id?: string
          integration_type?: string
          last_received_payload?: Json | null
          status?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_webhooks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      additional_services: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          period: string
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          period?: string
          price: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          period?: string
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agents_connections: {
        Row: {
          created_at: string | null
          id: string
          instance_name: string
          last_checked_at: string | null
          metadata: Json | null
          phone_number: string | null
          product: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          instance_name: string
          last_checked_at?: string | null
          metadata?: Json | null
          phone_number?: string | null
          product?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_name?: string
          last_checked_at?: string | null
          metadata?: Json | null
          phone_number?: string | null
          product?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_connections_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      authorized_emails: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_active: boolean
          notes: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean
          notes?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean
          notes?: string | null
        }
        Relationships: []
      }
      chatwoot_accounts: {
        Row: {
          account_id: number
          created_at: string
          id: string
          inbox_id: number
          user_id: string | null
          website_token: string
        }
        Insert: {
          account_id: number
          created_at?: string
          id?: string
          inbox_id: number
          user_id?: string | null
          website_token: string
        }
        Update: {
          account_id?: number
          created_at?: string
          id?: string
          inbox_id?: number
          user_id?: string | null
          website_token?: string
        }
        Relationships: []
      }
      facebook_ad_accounts: {
        Row: {
          access_token: string
          account_id: string
          account_name: string | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          account_id: string
          account_name?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          account_id?: string
          account_name?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_ad_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_campaigns: {
        Row: {
          ad_account_id: string | null
          campaign_id: string
          created_at: string | null
          daily_budget: number | null
          end_time: string | null
          id: string
          lifetime_budget: number | null
          name: string
          start_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ad_account_id?: string | null
          campaign_id: string
          created_at?: string | null
          daily_budget?: number | null
          end_time?: string | null
          id?: string
          lifetime_budget?: number | null
          name: string
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_account_id?: string | null
          campaign_id?: string
          created_at?: string | null
          daily_budget?: number | null
          end_time?: string | null
          id?: string
          lifetime_budget?: number | null
          name?: string
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facebook_campaigns_ad_account_id_fkey"
            columns: ["ad_account_id"]
            isOneToOne: false
            referencedRelation: "facebook_ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_animalsex: {
        Row: {
          agendamento: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string
          fotos: string | null
          id: string
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string
          profile_id: string
          push_name: string | null
          session_id: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id: string
          push_name?: string | null
          session_id?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id?: string
          push_name?: string | null
          session_id?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_animalsex_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_animalsex_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_animalsex_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_animalsex_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_body_modelador: {
        Row: {
          agendamento: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string
          fotos: string | null
          id: string
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string
          profile_id: string
          push_name: string | null
          session_id: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id: string
          push_name?: string | null
          session_id?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id?: string
          push_name?: string | null
          session_id?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_body_modelador_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_body_modelador_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_body_modelador_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_body_modelador_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_liposense: {
        Row: {
          agendamento: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string
          fotos: string | null
          id: string
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string
          profile_id: string
          push_name: string | null
          session_id: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id: string
          push_name?: string | null
          session_id?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id?: string
          push_name?: string | null
          session_id?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_liposense_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_liposense_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_liposense_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_liposense_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_menosense: {
        Row: {
          agendamento: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string
          fotos: string | null
          id: string
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string
          profile_id: string
          push_name: string | null
          session_id: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id: string
          push_name?: string | null
          session_id?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id?: string
          push_name?: string | null
          session_id?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_menosense_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_menosense_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_menosense_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_menosense_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_suti_plus_confort: {
        Row: {
          agendamento: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string
          fotos: string | null
          id: string
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string
          profile_id: string
          push_name: string | null
          session_id: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id: string
          push_name?: string | null
          session_id?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id?: string
          push_name?: string | null
          session_id?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_suti_plus_confort_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_plus_confort_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_plus_confort_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_plus_confort_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_suti_slim_confort: {
        Row: {
          agendamento: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string
          fotos: string | null
          id: string
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string
          profile_id: string
          push_name: string | null
          session_id: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id: string
          push_name?: string | null
          session_id?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          agendamento?: string | null
          connection_settings_id?: string | null
          created_at?: string | null
          etapa?: string | null
          follow_up_stage?: string
          fotos?: string | null
          id?: string
          last_follow_up_sent?: string | null
          last_updated?: string | null
          next_follow_up?: string | null
          phone_number?: string | null
          product_id?: string
          profile_id?: string
          push_name?: string | null
          session_id?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_suti_slim_confort_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_slim_confort_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_slim_confort_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logzz_orders: {
        Row: {
          account_id: string | null
          affiliate_email: string | null
          affiliate_name: string | null
          client_address: string | null
          client_address_city: string | null
          client_address_comp: string | null
          client_address_country: string | null
          client_address_district: string | null
          client_address_number: string | null
          client_address_state: string | null
          client_documment: string | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          client_zip_code: string | null
          commission: number | null
          created_at: string | null
          date_delivery: string | null
          date_delivery_day: string | null
          date_order: string | null
          date_order_day: string | null
          delivery_estimate: string | null
          delivery_man: string | null
          delivery_man_phone: string | null
          first_order: boolean | null
          id: string
          last_updated: string | null
          logistic_operator: string | null
          loss_amount: number | null
          order_final_price: number | null
          order_number: string
          order_quantity: number | null
          order_status_description: string | null
          producer_email: string | null
          producer_name: string | null
          products: Json | null
          second_order: boolean | null
          status: Database["public"]["Enums"]["order_status_type"] | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          webhook_last_update: string | null
        }
        Insert: {
          account_id?: string | null
          affiliate_email?: string | null
          affiliate_name?: string | null
          client_address?: string | null
          client_address_city?: string | null
          client_address_comp?: string | null
          client_address_country?: string | null
          client_address_district?: string | null
          client_address_number?: string | null
          client_address_state?: string | null
          client_documment?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          client_zip_code?: string | null
          commission?: number | null
          created_at?: string | null
          date_delivery?: string | null
          date_delivery_day?: string | null
          date_order?: string | null
          date_order_day?: string | null
          delivery_estimate?: string | null
          delivery_man?: string | null
          delivery_man_phone?: string | null
          first_order?: boolean | null
          id?: string
          last_updated?: string | null
          logistic_operator?: string | null
          loss_amount?: number | null
          order_final_price?: number | null
          order_number: string
          order_quantity?: number | null
          order_status_description?: string | null
          producer_email?: string | null
          producer_name?: string | null
          products?: Json | null
          second_order?: boolean | null
          status?: Database["public"]["Enums"]["order_status_type"] | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          webhook_last_update?: string | null
        }
        Update: {
          account_id?: string | null
          affiliate_email?: string | null
          affiliate_name?: string | null
          client_address?: string | null
          client_address_city?: string | null
          client_address_comp?: string | null
          client_address_country?: string | null
          client_address_district?: string | null
          client_address_number?: string | null
          client_address_state?: string | null
          client_documment?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          client_zip_code?: string | null
          commission?: number | null
          created_at?: string | null
          date_delivery?: string | null
          date_delivery_day?: string | null
          date_order?: string | null
          date_order_day?: string | null
          delivery_estimate?: string | null
          delivery_man?: string | null
          delivery_man_phone?: string | null
          first_order?: boolean | null
          id?: string
          last_updated?: string | null
          logistic_operator?: string | null
          loss_amount?: number | null
          order_final_price?: number | null
          order_number?: string
          order_quantity?: number | null
          order_status_description?: string | null
          producer_email?: string | null
          producer_name?: string | null
          products?: Json | null
          second_order?: boolean | null
          status?: Database["public"]["Enums"]["order_status_type"] | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          webhook_last_update?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logzz_orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          message: string
          read: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_status_logs: {
        Row: {
          account_id: string
          created_at: string | null
          id: string
          new_status: Database["public"]["Enums"]["order_status_type"]
          order_number: string
          previous_status:
            | Database["public"]["Enums"]["order_status_type"]
            | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["order_status_type"]
          order_number: string
          previous_status?:
            | Database["public"]["Enums"]["order_status_type"]
            | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["order_status_type"]
          order_number?: string
          previous_status?:
            | Database["public"]["Enums"]["order_status_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_logs_order_number_account_id_fkey"
            columns: ["order_number", "account_id"]
            isOneToOne: false
            referencedRelation: "logzz_orders"
            referencedColumns: ["order_number", "account_id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          plan_id: string
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          plan_id: string
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          created_at: string | null
          highlight: boolean
          id: string
          messages_limit: number
          name: string
          period: string
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          highlight?: boolean
          id?: string
          messages_limit: number
          name: string
          period?: string
          price: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          highlight?: boolean
          id?: string
          messages_limit?: number
          name?: string
          period?: string
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_tables: {
        Row: {
          created_at: string | null
          product_id: string
          table_name: string
        }
        Insert: {
          created_at?: string | null
          product_id: string
          table_name: string
        }
        Update: {
          created_at?: string | null
          product_id?: string
          table_name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          cpa: number | null
          created_at: string | null
          delivery_performance: number | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          marketing: number | null
          name: string
          net_profit: number | null
          pending: number | null
          product_cost: number | null
          revenue: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cpa?: number | null
          created_at?: string | null
          delivery_performance?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          marketing?: number | null
          name: string
          net_profit?: number | null
          pending?: number | null
          product_cost?: number | null
          revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cpa?: number | null
          created_at?: string | null
          delivery_performance?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          marketing?: number | null
          name?: string
          net_profit?: number | null
          pending?: number | null
          product_cost?: number | null
          revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          birth_date: string | null
          cpf: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          birth_date?: string | null
          cpf?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          birth_date?: string | null
          cpf?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      superadmins: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      system_agents: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_position: number | null
          price_label: string | null
          requires_plan: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_position?: number | null
          price_label?: string | null
          requires_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_position?: number | null
          price_label?: string | null
          requires_plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_ad_accounts: {
        Row: {
          access_token: string
          advertiser_id: string
          advertiser_name: string | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          advertiser_id: string
          advertiser_name?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          advertiser_id?: string
          advertiser_name?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_ad_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universal_webhook_events: {
        Row: {
          error_message: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          raw_payload: Json
          received_at: string | null
          status: string | null
          webhook_path: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          raw_payload: Json
          received_at?: string | null
          status?: string | null
          webhook_path: string
        }
        Update: {
          error_message?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          raw_payload?: Json
          received_at?: string | null
          status?: string | null
          webhook_path?: string
        }
        Relationships: []
      }
      user_connection_settings: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          instancia: string | null
          telefone_empresa: string | null
          updated_at: string | null
          url_api: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          instancia?: string | null
          telefone_empresa?: string | null
          updated_at?: string | null
          url_api?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          instancia?: string | null
          telefone_empresa?: string | null
          updated_at?: string | null
          url_api?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connection_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_errors: {
        Row: {
          error_message: string
          id: string
          payload: Json | null
          received_at: string | null
        }
        Insert: {
          error_message: string
          id?: string
          payload?: Json | null
          received_at?: string | null
        }
        Update: {
          error_message?: string
          id?: string
          payload?: Json | null
          received_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          error_message: string | null
          event_type: string
          id: string
          metadata: Json | null
          payload: Json
          processed_at: string | null
          status: string | null
          webhook_id: string
        }
        Insert: {
          error_message?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          payload: Json
          processed_at?: string | null
          status?: string | null
          webhook_id: string
        }
        Update: {
          error_message?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          payload?: Json
          processed_at?: string | null
          status?: string | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          account_id: string
          id: string
          payload: Json
          received_at: string | null
          webhook_id: string
        }
        Insert: {
          account_id: string
          id?: string
          payload: Json
          received_at?: string | null
          webhook_id: string
        }
        Update: {
          account_id?: string
          id?: string
          payload?: Json
          received_at?: string | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "account_webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          account_id: string | null
          account_name: string | null
          created_at: string | null
          id: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          last_used_at: string | null
          metadata: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
          webhook_url: string
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          created_at?: string | null
          id?: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          last_used_at?: string | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          webhook_url: string
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          created_at?: string | null
          id?: string
          integration_type?: Database["public"]["Enums"]["integration_type"]
          last_used_at?: string | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_connections: {
        Row: {
          created_at: string | null
          id: string
          instance_name: string
          last_checked_at: string | null
          metadata: Json | null
          phone_number: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          instance_name: string
          last_checked_at?: string | null
          metadata?: Json | null
          phone_number?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_name?: string
          last_checked_at?: string | null
          metadata?: Json | null
          phone_number?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_deletion_notifications: {
        Row: {
          deleted_at: string
          id: string
          instance_name: string
          read: boolean
          reason: string
          user_id: string
        }
        Insert: {
          deleted_at?: string
          id?: string
          instance_name: string
          read?: boolean
          reason: string
          user_id: string
        }
        Update: {
          deleted_at?: string
          id?: string
          instance_name?: string
          read?: boolean
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      financial_dashboard: {
        Row: {
          plan_price: number | null
          plan_type: string | null
          total_revenue: number | null
          user_count: number | null
        }
        Relationships: []
      }
      lead_animalsex_with_connections: {
        Row: {
          agendamento: string | null
          api_key: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string | null
          fotos: string | null
          id: string | null
          instancia: string | null
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string | null
          profile_id: string | null
          push_name: string | null
          session_id: string | null
          telefone_empresa: string | null
          url_api: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_animalsex_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_animalsex_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_animalsex_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_animalsex_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_body_modelador_with_connections: {
        Row: {
          agendamento: string | null
          api_key: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string | null
          fotos: string | null
          id: string | null
          instancia: string | null
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string | null
          profile_id: string | null
          push_name: string | null
          session_id: string | null
          telefone_empresa: string | null
          url_api: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_body_modelador_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_body_modelador_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_body_modelador_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_body_modelador_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_liposense_with_connections: {
        Row: {
          agendamento: string | null
          api_key: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string | null
          fotos: string | null
          id: string | null
          instancia: string | null
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string | null
          profile_id: string | null
          push_name: string | null
          session_id: string | null
          telefone_empresa: string | null
          url_api: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_liposense_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_liposense_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_liposense_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_liposense_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_menosense_with_connections: {
        Row: {
          agendamento: string | null
          api_key: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string | null
          fotos: string | null
          id: string | null
          instancia: string | null
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string | null
          profile_id: string | null
          push_name: string | null
          session_id: string | null
          telefone_empresa: string | null
          url_api: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_menosense_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_menosense_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_menosense_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_menosense_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_suti_plus_confort_with_connections: {
        Row: {
          agendamento: string | null
          api_key: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string | null
          fotos: string | null
          id: string | null
          instancia: string | null
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string | null
          profile_id: string | null
          push_name: string | null
          session_id: string | null
          telefone_empresa: string | null
          url_api: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_suti_plus_confort_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_plus_confort_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_plus_confort_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_plus_confort_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_suti_slim_confort_with_connections: {
        Row: {
          agendamento: string | null
          api_key: string | null
          connection_settings_id: string | null
          created_at: string | null
          etapa: string | null
          follow_up_stage: string | null
          fotos: string | null
          id: string | null
          instancia: string | null
          last_follow_up_sent: string | null
          last_updated: string | null
          next_follow_up: string | null
          phone_number: string | null
          product_id: string | null
          profile_id: string | null
          push_name: string | null
          session_id: string | null
          telefone_empresa: string | null
          url_api: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_suti_slim_confort_connection_settings_id_fkey"
            columns: ["connection_settings_id"]
            isOneToOne: false
            referencedRelation: "user_connection_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_slim_confort_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_suti_slim_confort_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      check_and_delete_inactive_connections: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_product_leads_table: {
        Args: { p_id: string; product_name: string }
        Returns: undefined
      }
      create_user_with_profile: {
        Args: { user_email: string; user_password: string }
        Returns: Json
      }
      delete_inactive_whatsapp_connections: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_or_create_connection_settings: {
        Args: { user_uuid: string }
        Returns: string
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_email_authorized: {
        Args: { email: string }
        Returns: boolean
      }
      is_superadmin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      reset_monthly_leads_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      update_plan_limits: {
        Args: { user_uuid: string; plan_name: string }
        Returns: undefined
      }
      urlencode: {
        Args: { string: string } | { string: string } | { data: Json }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      connection_status: "pending" | "connected" | "expired" | "active"
      integration_type: "logzz" | "facebook_ads" | "tiktok_ads" | "chatwoot"
      order_status:
        | "Aguardando Pagamento"
        | "Aguardando Confirmação"
        | "Aprovado"
        | "Em Produção"
        | "Separado"
        | "Em Trânsito"
        | "Entregue"
        | "Cancelado"
        | "Devolvido"
        | "Extraviado"
      order_status_type:
        | "Agendado"
        | "Reagendado"
        | "Atrasado"
        | "Completo"
        | "Frustrado"
        | "Cancelado"
        | "A enviar"
        | "Enviando"
        | "Enviado"
        | "Reembolsado"
        | "Confirmado"
        | "Em aberto"
        | "A reagendar"
        | "Em separação"
        | "Em rota"
        | "A caminho"
        | "Entregue"
        | "Separado"
        | "Em Trânsito"
      plan_type: "Free" | "Baby" | "Start" | "Pro" | "Escale"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      connection_status: ["pending", "connected", "expired", "active"],
      integration_type: ["logzz", "facebook_ads", "tiktok_ads", "chatwoot"],
      order_status: [
        "Aguardando Pagamento",
        "Aguardando Confirmação",
        "Aprovado",
        "Em Produção",
        "Separado",
        "Em Trânsito",
        "Entregue",
        "Cancelado",
        "Devolvido",
        "Extraviado",
      ],
      order_status_type: [
        "Agendado",
        "Reagendado",
        "Atrasado",
        "Completo",
        "Frustrado",
        "Cancelado",
        "A enviar",
        "Enviando",
        "Enviado",
        "Reembolsado",
        "Confirmado",
        "Em aberto",
        "A reagendar",
        "Em separação",
        "Em rota",
        "A caminho",
        "Entregue",
        "Separado",
        "Em Trânsito",
      ],
      plan_type: ["Free", "Baby", "Start", "Pro", "Escale"],
    },
  },
} as const
