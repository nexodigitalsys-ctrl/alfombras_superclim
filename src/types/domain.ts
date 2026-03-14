export const rugStatuses = [
  "received",
  "pending_cleaning",
  "cleaning",
  "drying",
  "ready_to_store",
  "stored",
  "pending_exit",
  "delivered",
  "cancelled",
] as const;

export const serviceTypes = [
  "storage_only",
  "cleaning_and_storage",
  "cleaning_storage_delivery",
] as const;

export const sizeCategories = [
  "small",
  "medium",
  "large",
  "extra_large",
] as const;

export const movementTypes = [
  "entry",
  "relocation",
  "exit",
] as const;

export type RugStatus = (typeof rugStatuses)[number];
export type ServiceType = (typeof serviceTypes)[number];
export type SizeCategory = (typeof sizeCategories)[number];
export type MovementType = (typeof movementTypes)[number];
