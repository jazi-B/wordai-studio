-- Documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text default 'Untitled Document',
  content jsonb,
  content_text text,
  word_count integer default 0,
  is_public boolean default false,
  public_token text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Settings
create table user_settings (
  user_id uuid primary key references auth.users(id),
  default_model text default 'gemini-2.0-flash',
  default_citation_style text default 'APA',
  custom_system_prompt text,
  temperature float default 0.7,
  dark_mode boolean default false,
  settings_json jsonb
);

-- Chat History
create table chat_history (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  role text check (role in ('user','assistant')),
  content text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table documents enable row level security;
alter table user_settings enable row level security;
alter table chat_history enable row level security;

-- Policies
create policy "Users can manage own documents" on documents
  for all using (auth.uid() = user_id);

create policy "Users can manage own settings" on user_settings
  for all using (auth.uid() = user_id);

create policy "Users can manage own chat history" on chat_history
  for all using (
    document_id in (select id from documents where user_id = auth.uid())
  );
