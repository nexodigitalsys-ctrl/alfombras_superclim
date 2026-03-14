insert into storage_locations (zone, rack, level, position)
values
  ('A', '1', '1', '1'),
  ('A', '1', '1', '2'),
  ('A', '1', '2', '1'),
  ('B', '1', '1', '1')
on conflict do nothing;

insert into pricing_rules (
  service_type,
  size_category,
  base_price,
  price_per_m2,
  storage_daily_price,
  cleaning_price,
  delivery_price,
  extra_price,
  is_active
)
values
  ('storage_only', 'small', 12.00, 0, 0.40, 0, 0, 0, true),
  ('cleaning_and_storage', 'medium', 18.00, 4.50, 0.55, 16.00, 0, 0, true),
  ('cleaning_storage_delivery', 'large', 24.00, 5.50, 0.70, 20.00, 18.00, 0, true)
on conflict do nothing;
