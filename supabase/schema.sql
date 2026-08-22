-- ============================================================
-- BORONDALA ADMIN - SUPABASE SCHEMA
-- Run this whole file in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- ---------- TABLES ----------

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'wedding',
  image_url text not null,
  storage_path text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'wedding',
  url text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  label text not null default '',
  quote text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tagline text not null default '',
  price text not null default '',
  features jsonb not null default '[]'::jsonb,
  is_popular boolean not null default false,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'estimate',
  plan_type text not null default '',
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  event_type text not null default '',
  event_location text not null default '',
  event_date text not null default '',
  budget text not null default '',
  services text not null default '',
  details text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_portfolio_category on public.portfolio_items (category, sort_order);
create index if not exists idx_leads_created on public.leads (created_at desc);

-- ---------- ROW LEVEL SECURITY ----------

alter table public.portfolio_items enable row level security;
alter table public.videos        enable row level security;
alter table public.testimonials  enable row level security;
alter table public.packages      enable row level security;
alter table public.leads         enable row level security;

-- Content tables: anyone can read visible rows; admins do everything
drop policy if exists "public read visible portfolio" on public.portfolio_items;
create policy "public read visible portfolio" on public.portfolio_items
  for select using (is_visible = true);

drop policy if exists "admin all portfolio" on public.portfolio_items;
create policy "admin all portfolio" on public.portfolio_items
  for all to authenticated using (true) with check (true);

drop policy if exists "public read visible videos" on public.videos;
create policy "public read visible videos" on public.videos
  for select using (is_visible = true);

drop policy if exists "admin all videos" on public.videos;
create policy "admin all videos" on public.videos
  for all to authenticated using (true) with check (true);

drop policy if exists "public read visible testimonials" on public.testimonials;
create policy "public read visible testimonials" on public.testimonials
  for select using (is_visible = true);

drop policy if exists "admin all testimonials" on public.testimonials;
create policy "admin all testimonials" on public.testimonials
  for all to authenticated using (true) with check (true);

drop policy if exists "public read visible packages" on public.packages;
create policy "public read visible packages" on public.packages
  for select using (is_visible = true);

drop policy if exists "admin all packages" on public.packages;
create policy "admin all packages" on public.packages
  for all to authenticated using (true) with check (true);

-- Leads: visitors may only INSERT; only admins may read/update/delete
drop policy if exists "anyone can submit lead" on public.leads;
create policy "anyone can submit lead" on public.leads
  for insert to anon, authenticated with check (true);

drop policy if exists "admin read leads" on public.leads;
create policy "admin read leads" on public.leads
  for select to authenticated using (true);

drop policy if exists "admin update leads" on public.leads;
create policy "admin update leads" on public.leads
  for update to authenticated using (true) with check (true);

drop policy if exists "admin delete leads" on public.leads;
create policy "admin delete leads" on public.leads
  for delete to authenticated using (true);

-- ---------- STORAGE BUCKET (portfolio images) ----------

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "public read portfolio files" on storage.objects;
create policy "public read portfolio files" on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists "admin upload portfolio files" on storage.objects;
create policy "admin upload portfolio files" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio');

drop policy if exists "admin update portfolio files" on storage.objects;
create policy "admin update portfolio files" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio');

drop policy if exists "admin delete portfolio files" on storage.objects;
create policy "admin delete portfolio files" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio');

-- ---------- DONE ----------
-- Next step: Authentication > Users > "Add user" >
-- create your admin login (email + password). Do NOT share these credentials.
