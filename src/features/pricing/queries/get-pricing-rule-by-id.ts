import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { PricingRule } from "@/features/pricing/types/pricing-rule";

type GetPricingRuleByIdResult =
  | { data: PricingRule; error: null }
  | { data: null; error: string };

export async function getPricingRuleById(
  id: string,
): Promise<GetPricingRuleByIdResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pricing_rules")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return {
        data: null,
        error: "Regla de precio no encontrada.",
      };
    }

    return {
      data: data as PricingRule,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "No se pudo cargar la regla de precio.",
    };
  }
}
