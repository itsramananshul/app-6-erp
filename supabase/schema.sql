-- APP 6 — ERP System: schema
-- Paste into the Supabase SQL editor and run once per project.

create extension if not exists "pgcrypto";

create table if not exists public.erp_records (
  id                uuid          primary key default gen_random_uuid(),
  instance_name     text          not null,
  record_number     text          not null,
  record_type       text          not null default 'COMPLIANCE',
  title             text          not null,
  description       text          not null default '',
  department        text          not null,
  responsible_party text          not null,
  status            text          not null default 'PENDING_REVIEW',
  compliance_status text          not null default 'COMPLIANT',
  due_date          date          not null,
  completed_date    date,
  financial_impact  numeric(14,2) not null default 0,
  notes             text          not null default '',
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now(),
  unique (instance_name, record_number)
);

create index if not exists erp_instance_idx
  on public.erp_records (instance_name);

create index if not exists erp_status_idx
  on public.erp_records (instance_name, status);

create index if not exists erp_compliance_idx
  on public.erp_records (instance_name, compliance_status);

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.erp_records;
create trigger set_updated_at
  before update on public.erp_records
  for each row execute function update_updated_at_column();

alter table public.erp_records disable row level security;
