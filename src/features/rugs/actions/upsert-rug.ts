"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { rugSchema } from "@/features/rugs/schemas/rug-schema";
import type { RugFormState } from "@/features/rugs/types/rug";
import type { PricingRule } from "@/features/pricing/types/pricing-rule";
import { calculateRugPricing } from "@/lib/pricing/calculate-rug-pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const initialState: RugFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

function normalizeValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

async function generateRugCode(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const year = new Date().getFullYear();
  const prefix = `SC-${year}-`;

  const { data } = await supabase
    .from("rugs")
    .select("code")
    .like("code", `${prefix}%`)
    .order("code", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastNumber = data?.code ? Number.parseInt(data.code.slice(-4), 10) : 0;
  const nextNumber = Number.isNaN(lastNumber) ? 1 : lastNumber + 1;

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

export async function upsertRugAction(
  _previousState: RugFormState,
  formData: FormData,
): Promise<RugFormState> {
  const rugId = normalizeValue(formData.get("id"));

  const parsed = rugSchema.safeParse({
    clientId: normalizeValue(formData.get("clientId")),
    type: normalizeValue(formData.get("type")),
    widthCm: normalizeValue(formData.get("widthCm")),
    lengthCm: normalizeValue(formData.get("lengthCm")),
    sizeCategory: normalizeValue(formData.get("sizeCategory")),
    primaryColor: normalizeValue(formData.get("primaryColor")),
    conditionIn: normalizeValue(formData.get("conditionIn")),
    currentStatus: normalizeValue(formData.get("currentStatus")),
    storageLocationId: normalizeValue(formData.get("storageLocationId")),
    entryDate: normalizeValue(formData.get("entryDate")),
    expectedExitDate: normalizeValue(formData.get("expectedExitDate")),
    actualExitDate: normalizeValue(formData.get("actualExitDate")),
    serviceType: normalizeValue(formData.get("serviceType")),
    includesCleaning: formData.get("includesCleaning") === "true",
    includesDelivery: formData.get("includesDelivery") === "true",
    basePrice: normalizeValue(formData.get("basePrice")),
    storagePrice: normalizeValue(formData.get("storagePrice")),
    extraPrice: normalizeValue(formData.get("extraPrice")),
    totalPrice: normalizeValue(formData.get("totalPrice")),
    notes: normalizeValue(formData.get("notes")),
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
    const { data: rule } = await supabase
      .from("pricing_rules")
      .select("*")
      .eq("service_type", parsed.data.serviceType)
      .eq("size_category", parsed.data.sizeCategory)
      .eq("is_active", true)
      .maybeSingle();

    const calculated = calculateRugPricing({
      widthCm: parsed.data.widthCm,
      lengthCm: parsed.data.lengthCm,
      sizeCategory: parsed.data.sizeCategory,
      serviceType: parsed.data.serviceType,
      includesCleaning: parsed.data.includesCleaning,
      includesDelivery: parsed.data.includesDelivery,
      entryDate: parsed.data.entryDate,
      expectedExitDate: parsed.data.expectedExitDate || null,
      actualExitDate: parsed.data.actualExitDate || null,
      rule: (rule as PricingRule | null) ?? null,
    });

    const payload = {
      client_id: parsed.data.clientId,
      type: parsed.data.type,
      width_cm: parsed.data.widthCm,
      length_cm: parsed.data.lengthCm,
      size_category: parsed.data.sizeCategory,
      primary_color: parsed.data.primaryColor || null,
      condition_in: parsed.data.conditionIn || null,
      current_status: parsed.data.currentStatus,
      storage_location_id: null as string | null,
      entry_date: parsed.data.entryDate,
      expected_exit_date: parsed.data.expectedExitDate || null,
      actual_exit_date: null as string | null,
      service_type: parsed.data.serviceType,
      includes_cleaning: parsed.data.includesCleaning,
      includes_delivery: parsed.data.includesDelivery,
      base_price: calculated.basePrice,
      storage_price: calculated.storagePrice,
      extra_price: calculated.extraPrice,
      total_price: calculated.totalPrice,
      notes: parsed.data.notes || null,
      photos: [],
    };

    if (rugId) {
      const { data: existingRug } = await supabase
        .from("rugs")
        .select("storage_location_id, current_status, actual_exit_date")
        .eq("id", rugId)
        .maybeSingle();

      const { error } = await supabase
        .from("rugs")
        .update({
          ...payload,
          storage_location_id: existingRug?.storage_location_id ?? null,
          current_status: existingRug?.current_status ?? parsed.data.currentStatus,
          actual_exit_date: existingRug?.actual_exit_date ?? null,
        })
        .eq("id", rugId);

      if (error) {
        return {
          status: "error",
          message: "No se pudo actualizar la alfombra.",
          fieldErrors: {},
        };
      }

      revalidatePath("/rugs");
      revalidatePath(`/rugs/${rugId}`);
      revalidatePath(`/rugs/${rugId}/edit`);
      redirect(`/rugs/${rugId}`);
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const code = await generateRugCode();
      const { data, error } = await supabase
        .from("rugs")
        .insert({
          ...payload,
          code,
        })
        .select("id")
        .single();

      if (!error && data) {
        const movementResponse = await supabase.rpc("apply_rug_movement", {
          p_rug_id: data.id,
          p_movement_type: "entry",
          p_to_location_id: parsed.data.storageLocationId || null,
          p_notes: "Registro inicial de entrada",
        });

        if (movementResponse.error) {
          return {
            status: "error",
            message: "La alfombra se creo, pero fallo el movimiento inicial.",
            fieldErrors: {},
          };
        }

        revalidatePath("/rugs");
        redirect(`/rugs/${data.id}`);
      }

      if (error?.code !== "23505") {
        return {
          status: "error",
          message: "No se pudo crear la alfombra.",
          fieldErrors: {},
        };
      }
    }

    return {
      status: "error",
      message: "No se pudo generar un codigo unico para la alfombra.",
      fieldErrors: {},
    };
  } catch {
    return {
      status: "error",
      message: "No se pudo guardar la alfombra. Revisa la conexion con Supabase.",
      fieldErrors: {},
    };
  }
}

export const rugFormInitialState = initialState;
