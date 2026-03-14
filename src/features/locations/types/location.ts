import type { Database } from "@/types/database";

export type StorageLocation = Database["public"]["Tables"]["storage_locations"]["Row"];

export type LocationFormValues = {
  zone: string;
  rack: string;
  level: string;
  position: string;
  isOccupied: boolean;
};

export type LocationFormState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof LocationFormValues, string[]>>;
};
