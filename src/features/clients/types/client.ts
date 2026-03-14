import type { Database } from "@/types/database";

export type Client = Database["public"]["Tables"]["clients"]["Row"];

export type ClientFormValues = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

export type ClientFormState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof ClientFormValues, string[]>>;
};
