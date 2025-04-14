export interface TiktokAdAccount {
  id: string;
  user_id: string;
  advertiser_id: string;
  access_token: string;
  advertiser_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_sync_at: string | null;
}