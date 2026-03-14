import type { Database } from "@/types/database";

export type RugMovement = Database["public"]["Tables"]["rug_movements"]["Row"] & {
  from_location: {
    id: string;
    label: string;
  } | null;
  to_location: {
    id: string;
    label: string;
  } | null;
};

export type RugMovementFormState = {
  status: "idle" | "error";
  message: string | null;
};
