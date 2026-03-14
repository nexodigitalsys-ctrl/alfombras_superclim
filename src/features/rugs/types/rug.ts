import type { Database } from "@/types/database";
import type { PricingRule } from "@/features/pricing/types/pricing-rule";
import type { RugStatus, ServiceType, SizeCategory } from "@/types/domain";

export type Rug = Database["public"]["Tables"]["rugs"]["Row"];

export type RugListItem = Rug & {
  client: {
    id: string;
    full_name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;
  location: {
    id: string;
    label: string;
  } | null;
};

export type RugFormOptions = {
  clients: Array<{
    id: string;
    full_name: string;
  }>;
  locations: Array<{
    id: string;
    label: string;
    is_occupied: boolean;
  }>;
  pricingRules: PricingRule[];
};

export type RugFormValues = {
  clientId: string;
  type: string;
  widthCm: string;
  lengthCm: string;
  sizeCategory: SizeCategory;
  primaryColor: string;
  conditionIn: string;
  currentStatus: RugStatus;
  storageLocationId: string;
  entryDate: string;
  expectedExitDate: string;
  actualExitDate: string;
  serviceType: ServiceType;
  includesCleaning: boolean;
  includesDelivery: boolean;
  basePrice: string;
  storagePrice: string;
  extraPrice: string;
  totalPrice: string;
  notes: string;
};

export type RugFormState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof RugFormValues, string[]>>;
};
