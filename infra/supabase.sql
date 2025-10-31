-- infra/supabase.sql
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table documents (
  id uuid default uuid_generate_v4() primary key,
  filename text not null,
  owner_id uuid,
  original_path text not null,
  processed_path text,
  status text default 'uploaded',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table processing_jobs (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references documents(id) on delete cascade,
  status text default 'pending',
  logs text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
