export interface FacebookAdAccount {
  id: string;
  account_id: string;
  access_token: string;
  account_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_sync_at: string | null;
}

export interface FacebookCampaign {
  id: string;
  campaign_id: string;
  name: string;
  status: string;
  daily_budget: number | null;
  lifetime_budget: number | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
}