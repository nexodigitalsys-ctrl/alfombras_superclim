"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { pricingRuleSchema } from "@/features/pricing/schemas/pricing-rule-schema";
import type { PricingRuleFormState } from "@/features/pricing/types/pricing-rule";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const initialState: PricingRuleFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

function normalizeValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function upsertPricingRuleAction(
  _previousState: PricingRuleFormState,
  formData: FormData,
): Promise<PricingRuleFormState> {
  const ruleId = normalizeValue(formData.get("id"));

  const parsed = pricingRuleSchema.safeParse({
    serviceType: normalizeValue(formData.get("serviceType")),
    sizeCategory: normalizeValue(formData.get("sizeCategory")),
    basePrice: normalizeValue(formData.get("basePrice")),
    pricePerM2: normalizeValue(formData.get("pricePerM2")),
    storageDailyPrice: normalizeValue(formData.get("storageDailyPrice")),
    cleaningPrice: normalizeValue(formData.get("cleaningPrice")),
    deliveryPrice: normalizeValue(formData.get("deliveryPrice")),
    extraPrice: normalizeValue(formData.get("extraPrice")),
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const payload = {
      service_type: parsed.data.serviceType,
      size_category: parsed.data.sizeCategory,
      base_price: parsed.data.basePrice,
      price_per_m2: parsed.data.pricePerM2,
      storage_daily_price: parsed.data.storageDailyPrice,
      cleaning_price: parsed.data.cleaningPrice,
      delivery_price: parsed.data.deliveryPrice,
      extra_price: parsed.data.extraPrice,
      is_active: parsed.data.isActive,
    };

    if (ruleId) {
      const { error } = await supabase
        .from("pricing_rules")
        .update(payload)
        .eq("id", ruleId);

      if (error) {
        return {
          status: "error",
          message:
            error.code === "23505"
              ? "Ya existe una regla activa para ese servicio y tamano."
              : "No se pudo actualizar la regla.",
          fieldErrors: {},
        };
      }

      revalidatePath("/pricing");
      revalidatePath(`/pricing/${ruleId}`);
      revalidatePath(`/pricing/${ruleId}/edit`);
      redirect(`/pricing/${ruleId}`);
    }

    const { data, error } = await supabase
      .from("pricing_rules")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      return {
        status: "error",
        message:
          error?.code === "23505"
            ? "Ya existe una regla activa para ese servicio y tamano."
            : "No se pudo crear la regla.",
        fieldErrors: {},
      };
    }

    revalidatePath("/pricing");
    redirect(`/pricing/${data.id}`);
  } catch {
    return {
      status: "error",
      message: "No se pudo guardar la regla de precio.",
      fieldErrors: {},
    };
  }
}

export const pricingRuleFormInitialState = initialState;
