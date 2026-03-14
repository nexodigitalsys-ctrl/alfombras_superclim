"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  buildLocationLabel,
  locationSchema,
} from "@/features/locations/schemas/location-schema";
import type { LocationFormState } from "@/features/locations/types/location";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function upsertLocationAction(
  _previousState: LocationFormState,
  formData: FormData,
): Promise<LocationFormState> {
  const locationId = normalizeValue(formData.get("id"));

  const parsed = locationSchema.safeParse({
    zone: normalizeValue(formData.get("zone")),
    rack: normalizeValue(formData.get("rack")),
    level: normalizeValue(formData.get("level")),
    position: normalizeValue(formData.get("position")),
    isOccupied: formData.get("isOccupied") === "true",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const label = buildLocationLabel(
    parsed.data.zone,
    parsed.data.rack,
    parsed.data.level,
    parsed.data.position,
  );

  try {
    const supabase = await createSupabaseServerClient();
    const existingLocation = locationId
      ? await supabase
          .from("storage_locations")
          .select("is_occupied")
          .eq("id", locationId)
          .maybeSingle()
      : null;

    const payload = {
      zone: parsed.data.zone,
      rack: parsed.data.rack,
      level: parsed.data.level,
      position: parsed.data.position,
      is_occupied: existingLocation?.data?.is_occupied ?? false,
    };

    if (locationId) {
      const { error } = await supabase
        .from("storage_locations")
        .update(payload)
        .eq("id", locationId);

      if (error) {
        const isDuplicate = error.code === "23505";
        return {
          status: "error",
          message: isDuplicate
            ? `La ubicacion ${label} ya existe.`
            : "No se pudo actualizar la ubicacion.",
          fieldErrors: {},
        };
      }

      revalidatePath("/locations");
      revalidatePath(`/locations/${locationId}`);
      revalidatePath(`/locations/${locationId}/edit`);
      redirect(`/locations/${locationId}`);
    }

    const { data, error } = await supabase
      .from("storage_locations")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      const isDuplicate = error?.code === "23505";
      return {
        status: "error",
        message: isDuplicate
          ? `La ubicacion ${label} ya existe.`
          : "No se pudo crear la ubicacion.",
        fieldErrors: {},
      };
    }

    revalidatePath("/locations");
    redirect(`/locations/${data.id}`);
  } catch {
    return {
      status: "error",
      message:
        "No se pudo guardar la ubicacion. Revisa la conexion con Supabase.",
      fieldErrors: {},
    };
  }

  return {
    status: "idle",
    message: null,
    fieldErrors: {},
  };
}
