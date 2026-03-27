-- Run this in the Supabase SQL editor or via CLI so `profiles` stores legal acceptance at registration.
alter table public.profiles
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

comment on column public.profiles.terms_accepted_at is 'When the user accepted Terms and Privacy at registration.';
comment on column public.profiles.terms_version is 'Version identifier for the accepted legal documents (app constant LEGAL_DOCUMENTS_VERSION).';
