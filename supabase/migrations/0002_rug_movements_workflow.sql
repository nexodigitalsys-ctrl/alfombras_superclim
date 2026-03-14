alter table rug_movements
drop constraint if exists rug_movements_location_changed;

alter table rug_movements
add constraint rug_movements_location_changed check (
  movement_type <> 'relocation' or from_location_id is distinct from to_location_id
);

create or replace function apply_rug_movement(
  p_rug_id uuid,
  p_movement_type movement_type,
  p_to_location_id uuid default null,
  p_notes text default null,
  p_moved_at timestamptz default timezone('utc', now())
)
returns uuid
language plpgsql
as $$
declare
  current_rug rugs%rowtype;
  destination_location storage_locations%rowtype;
  active_rug_id uuid;
begin
  select *
  into current_rug
  from rugs
  where id = p_rug_id
  for update;

  if not found then
    raise exception 'Rug not found';
  end if;

  if p_movement_type in ('relocation', 'entry') and p_to_location_id is not null then
    select *
    into destination_location
    from storage_locations
    where id = p_to_location_id
    for update;

    if not found then
      raise exception 'Destination location not found';
    end if;

    select id
    into active_rug_id
    from rugs
    where storage_location_id = p_to_location_id
      and id <> p_rug_id
      and current_status not in ('delivered', 'cancelled')
    limit 1;

    if active_rug_id is not null or destination_location.is_occupied then
      raise exception 'Destination location is already occupied';
    end if;
  end if;

  if p_movement_type = 'entry' then
    if current_rug.storage_location_id is not null then
      update storage_locations
      set is_occupied = false
      where id = current_rug.storage_location_id;
    end if;

    update rugs
    set storage_location_id = p_to_location_id,
        current_status = case
          when p_to_location_id is not null then 'stored'
          else current_status
        end
    where id = p_rug_id;

    if p_to_location_id is not null then
      update storage_locations
      set is_occupied = true
      where id = p_to_location_id;
    end if;
  elsif p_movement_type = 'relocation' then
    if current_rug.current_status in ('delivered', 'cancelled') then
      raise exception 'Delivered or cancelled rugs cannot be moved';
    end if;

    if p_to_location_id is null then
      raise exception 'Destination location is required for relocation';
    end if;

    if current_rug.storage_location_id is not distinct from p_to_location_id then
      raise exception 'Destination location must be different from current location';
    end if;

    if current_rug.storage_location_id is not null then
      update storage_locations
      set is_occupied = false
      where id = current_rug.storage_location_id;
    end if;

    update rugs
    set storage_location_id = p_to_location_id,
        current_status = 'stored'
    where id = p_rug_id;

    update storage_locations
    set is_occupied = true
    where id = p_to_location_id;
  elsif p_movement_type = 'exit' then
    if current_rug.current_status in ('delivered', 'cancelled') then
      raise exception 'Rug is already closed';
    end if;

    if current_rug.storage_location_id is not null then
      update storage_locations
      set is_occupied = false
      where id = current_rug.storage_location_id;
    end if;

    update rugs
    set storage_location_id = null,
        current_status = 'delivered',
        actual_exit_date = coalesce(actual_exit_date, (p_moved_at at time zone 'utc')::date)
    where id = p_rug_id;
  else
    raise exception 'Unsupported movement type';
  end if;

  insert into rug_movements (
    rug_id,
    movement_type,
    from_location_id,
    to_location_id,
    moved_at,
    notes
  )
  values (
    p_rug_id,
    p_movement_type,
    current_rug.storage_location_id,
    p_to_location_id,
    p_moved_at,
    p_notes
  );

  return p_rug_id;
end;
$$;
