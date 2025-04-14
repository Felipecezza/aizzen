
create table public.webhooks (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  user_id uuid references auth.users(id),
  integration_type text not null,
  created_at timestamp with time zone default now(),
  last_used_at timestamp with time zone
);

-- Enable RLS
alter table public.webhooks enable row level security;

-- Create policy to allow users to see only their webhooks
create policy "Users can view their own webhooks"
  on public.webhooks
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own webhooks
create policy "Users can create webhooks"
  on public.webhooks
  for insert
  with check (auth.uid() = user_id);
