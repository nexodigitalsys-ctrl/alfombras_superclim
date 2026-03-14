create extension if not exists "pgcrypto";

create type rug_status as enum (
  'received',
  'pending_cleaning',
  'cleaning',
  'drying',
  'ready_to_store',
  'stored',
  'pending_exit',
  'delivered',
  'cancelled'
);

create type service_type as enum (
  'storage_only',
  'cleaning_and_storage',
  'cleaning_storage_delivery'
);

create type size_category as enum (
  'small',
  'medium',
  'large',
  'extra_large'
);

create type movement_type as enum (
  'entry',
  'relocation',
  'status_change',
  'exit'
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function build_storage_location_label(
  zone_value text,
  rack_value text,
  level_value text,
  position_value text
)
returns text
language sql
immutable
as $$
  select upper(trim(zone_value))
    || '-' || lpad(trim(rack_value), 2, '0')
    || '-' || lpad(trim(level_value), 2, '0')
    || '-' || lpad(trim(position_value), 2, '0');
$$;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint clients_full_name_not_blank check (btrim(full_name) <> ''),
  constraint clients_phone_not_blank check (btrim(phone) <> ''),
  constraint clients_email_format check (
    email is null or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
);

create table if not exists storage_locations (
  id uuid primary key default gen_random_uuid(),
  zone text not null,
  rack text not null,
  level text not null,
  position text not null,
  label text generated always as (
    build_storage_location_label(zone, rack, level, position)
  ) stored,
  is_occupied boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint storage_locations_zone_not_blank check (btrim(zone) <> ''),
  constraint storage_locations_rack_not_blank check (btrim(rack) <> ''),
  constraint storage_locations_level_not_blank check (btrim(level) <> ''),
  constraint storage_locations_position_not_blank check (btrim(position) <> '')
);

create table if not exists pricing_rules (
  id uuid primary key default gen_random_uuid(),
  service_type service_type not null,
  size_category size_category not null,
  base_price numeric(10, 2) not null default 0,
  price_per_m2 numeric(10, 2) not null default 0,
  storage_daily_price numeric(10, 2) not null default 0,
  cleaning_price numeric(10, 2) not null default 0,
  delivery_price numeric(10, 2) not null default 0,
  extra_price numeric(10, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint pricing_rules_base_price_non_negative check (base_price >= 0),
  constraint pricing_rules_price_per_m2_non_negative check (price_per_m2 >= 0),
  constraint pricing_rules_storage_daily_price_non_negative check (storage_daily_price >= 0),
  constraint pricing_rules_cleaning_price_non_negative check (cleaning_price >= 0),
  constraint pricing_rules_delivery_price_non_negative check (delivery_price >= 0),
  constraint pricing_rules_extra_price_non_negative check (extra_price >= 0),
  constraint pricing_rules_active_unique unique (service_type, size_category, is_active)
);

create table if not exists rugs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  code text not null,
  type text not null,
  width_cm integer not null,
  length_cm integer not null,
  size_category size_category not null,
  primary_color text,
  condition_in text,
  current_status rug_status not null default 'received',
  storage_location_id uuid references storage_locations(id) on delete set null,
  entry_date date not null,
  expected_exit_date date,
  actual_exit_date date,
  service_type service_type not null,
  includes_cleaning boolean not null default false,
  includes_delivery boolean not null default false,
  base_price numeric(10, 2) not null default 0,
  storage_price numeric(10, 2) not null default 0,
  extra_price numeric(10, 2) not null default 0,
  total_price numeric(10, 2) not null default 0,
  notes text,
  photos text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint rugs_code_unique unique (code),
  constraint rugs_type_not_blank check (btrim(type) <> ''),
  constraint rugs_width_positive check (width_cm > 0),
  constraint rugs_length_positive check (length_cm > 0),
  constraint rugs_base_price_non_negative check (base_price >= 0),
  constraint rugs_storage_price_non_negative check (storage_price >= 0),
  constraint rugs_extra_price_non_negative check (extra_price >= 0),
  constraint rugs_total_price_non_negative check (total_price >= 0),
  constraint rugs_expected_exit_after_entry check (
    expected_exit_date is null or expected_exit_date >= entry_date
  ),
  constraint rugs_actual_exit_after_entry check (
    actual_exit_date is null or actual_exit_date >= entry_date
  )
);

create table if not exists rug_movements (
  id uuid primary key default gen_random_uuid(),
  rug_id uuid not null references rugs(id) on delete cascade,
  movement_type movement_type not null,
  from_location_id uuid references storage_locations(id) on delete set null,
  to_location_id uuid references storage_locations(id) on delete set null,
  moved_at timestamptz not null default timezone('utc', now()),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint rug_movements_location_changed check (
    from_location_id is distinct from to_location_id
  )
);

create unique index if not exists storage_locations_label_key
  on storage_locations (label);

create unique index if not exists storage_locations_slot_unique_idx
  on storage_locations (upper(zone), rack, level, position);

create unique index if not exists pricing_rules_active_pair_unique_idx
  on pricing_rules (service_type, size_category)
  where is_active = true;

create unique index if not exists rugs_active_location_unique_idx
  on rugs (storage_location_id)
  where storage_location_id is not null and current_status <> 'delivered' and current_status <> 'cancelled';

create index if not exists clients_full_name_idx
  on clients (full_name);

create index if not exists rugs_client_id_idx
  on rugs (client_id);

create index if not exists rugs_current_status_idx
  on rugs (current_status);

create index if not exists rugs_entry_date_idx
  on rugs (entry_date desc);

create index if not exists rugs_expected_exit_date_idx
  on rugs (expected_exit_date);

create index if not exists rug_movements_rug_id_idx
  on rug_movements (rug_id);

create index if not exists rug_movements_moved_at_idx
  on rug_movements (moved_at desc);

create trigger set_clients_updated_at
before update on clients
for each row
execute function set_updated_at();

create trigger set_storage_locations_updated_at
before update on storage_locations
for each row
execute function set_updated_at();

create trigger set_pricing_rules_updated_at
before update on pricing_rules
for each row
execute function set_updated_at();

create trigger set_rugs_updated_at
before update on rugs
for each row
execute function set_updated_at();

create trigger set_rug_movements_updated_at
before update on rug_movements
for each row
execute function set_updated_at();
