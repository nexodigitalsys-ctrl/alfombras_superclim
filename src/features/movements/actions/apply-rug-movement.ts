"use server";

import { revalidatePath } from "next/cache";

import type { RugMovementFormState } from "@/features/movements/types/movement";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MovementType } from "@/types/domain";

function normalizeValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isMovementType(value: string): value is MovementType {
  return value === "entry" || value === "relocation" || value === "exit";
}

export async function applyRugMovementAction(
  _previousState: RugMovementFormState,
  formData: FormData,
): Promise<RugMovementFormState> {
  const rugId = normalizeValue(formData.get("rugId"));
  const movementType = normalizeValue(formData.get("movementType"));
  const toLocationId = normalizeValue(formData.get("toLocationId"));
  const notes = normalizeValue(formData.get("notes"));

  if (!rugId || !isMovementType(movementType)) {
    return {
      status: "error",
      message: "Movimiento no valido.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.rpc("apply_rug_movement", {
      p_rug_id: rugId,
      p_movement_type: movementType,
      p_to_location_id: toLocationId || null,
      p_notes: notes || null,
    });

    if (error) {
      return {
        status: "error",
        message:
          error.message === "Destination location is already occupied"
            ? "La ubicacion de destino ya esta ocupada."
            : "No se pudo aplicar el movimiento.",
      };
    }

    revalidatePath("/rugs");
    revalidatePath(`/rugs/${rugId}`);
    revalidatePath("/locations");

    return {
      status: "idle",
      message: null,
    };
  } catch {
    return {
      status: "error",
      message: "No se pudo aplicar el movimiento.",
    };
  }
}
