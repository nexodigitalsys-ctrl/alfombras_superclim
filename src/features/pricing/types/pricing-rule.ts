import type { Database } from "@/types/database";

export type PricingRule = Database["public"]["Tables"]["pricing_rules"]["Row"];

export type PricingRuleFormValues = {
  serviceType: PricingRule["service_type"];
  sizeCategory: PricingRule["size_category"];
  basePrice: string;
  pricePerM2: string;
  storageDailyPrice: string;
  cleaningPrice: string;
  deliveryPrice: string;
  extraPrice: string;
  isActive: boolean;
};

export type PricingRuleFormState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof PricingRuleFormValues, string[]>>;
};
