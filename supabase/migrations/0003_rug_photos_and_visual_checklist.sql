create type rug_photo_category as enum (
  'entry',
  'before_cleaning',
  'after_cleaning',
  'stored',
  'exit'
);

alter table rugs
add column if not exists photographed_on_entry boolean not null default false,
add column if not exists condition_reviewed boolean not null default false,
add column if not exists cleaning_completed boolean not null default false,
add column if not exists stored_correctly boolean not null default false,
add column if not exists ready_for_exit boolean not null default false;

create table if not exists rug_photos (
  id uuid primary key default gen_random_uuid(),
  rug_id uuid not null references rugs(id) on delete cascade,
  storage_path text not null,
  category rug_photo_category not null,
  caption text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint rug_photos_storage_path_not_blank check (btrim(storage_path) <> ''),
  constraint rug_photos_caption_length check (caption is null or char_length(caption) <= 160)
);

create index if not exists rug_photos_rug_id_idx
  on rug_photos (rug_id);

create index if not exists rug_photos_created_at_idx
  on rug_photos (created_at desc);

create trigger set_rug_photos_updated_at
before update on rug_photos
for each row
execute function set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'rug-photos',
  'rug-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
