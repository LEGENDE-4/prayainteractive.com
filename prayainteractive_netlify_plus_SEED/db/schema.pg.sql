create extension if not exists pgcrypto;
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  audience text check (audience in ('kids','seniors','cse')),
  company_or_org text, contact_name text, role_title text,
  email text, phone text, whatsapp text,
  country text, city text,
  consent_source text, consent_date date,
  language text default 'fr',
  segment_tags text[],
  website text, notes text,
  score int default 0,
  status text default 'new',
  last_touch_at timestamptz,
  next_touch_at timestamptz,
  owner text,
  created_at timestamptz default now()
);
create table if not exists touch_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  channel text check (channel in ('email','whatsapp')),
  variant text,
  sent_at timestamptz default now(),
  opened boolean, clicked boolean, replied boolean, unsubscribed boolean,
  meta jsonb
);
create table if not exists templates_email (
  id uuid primary key default gen_random_uuid(),
  audience text, variant text, subject text, preheader text,
  html_body text, text_body text, discount_code text, utm_campaign text
);
create table if not exists templates_wa (
  id uuid primary key default gen_random_uuid(),
  template_name text, language text, audience text, body_text text
);
