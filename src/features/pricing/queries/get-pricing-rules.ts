import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { PricingRule } from "@/features/pricing/types/pricing-rule";

type GetPricingRulesResult =
  | { data: PricingRule[]; error: null }
  | { data: PricingRule[]; error: string };

export async function getPricingRules(): Promise<GetPricingRulesResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pricing_rules")
      .select("*")
      .order("service_type")
      .order("size_category");

    if (error) {
      return {
        data: [],
        error: "No se pudieron cargar las reglas de precio.",
      };
    }

    return {
      data: data as PricingRule[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "Falta la configuracion de Supabase o no se pudo conectar.",
    };
  }
}
