import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { RugFormOptions } from "@/features/rugs/types/rug";

export async function getRugFormOptions(
  currentLocationId?: string | null,
): Promise<RugFormOptions> {
  try {
    const supabase = await createSupabaseServerClient();

    const [{ data: clients }, { data: locations }, { data: pricingRules }] =
      await Promise.all([
      supabase.from("clients").select("id, full_name").order("full_name"),
      currentLocationId
        ? supabase
            .from("storage_locations")
            .select("id, label, is_occupied")
            .or(`is_occupied.eq.false,id.eq.${currentLocationId}`)
            .order("label")
        : supabase
            .from("storage_locations")
            .select("id, label, is_occupied")
            .eq("is_occupied", false)
            .order("label"),
      supabase
        .from("pricing_rules")
        .select("*")
        .eq("is_active", true)
        .order("service_type")
        .order("size_category"),
    ]);

    return {
      clients: (clients ?? []) as RugFormOptions["clients"],
      locations: (locations ?? []) as RugFormOptions["locations"],
      pricingRules: (pricingRules ?? []) as RugFormOptions["pricingRules"],
    };
  } catch {
    return {
      clients: [],
      locations: [],
      pricingRules: [],
    };
  }
}
