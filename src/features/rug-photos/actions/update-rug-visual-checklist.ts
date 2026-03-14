"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { RugVisualChecklistState } from "@/features/rug-photos/types/rug-photo";

const rugVisualChecklistSchema = z.object({
  rugId: z.string().uuid("Alfombra invalida."),
});

function isChecked(formData: FormData, key: string): boolean {
  return formData.get(key) === "true";
}

export async function updateRugVisualChecklistAction(
  _previousState: RugVisualChecklistState,
  formData: FormData,
): Promise<RugVisualChecklistState> {
  const parsed = rugVisualChecklistSchema.safeParse({
    rugId: formData.get("rugId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Checklist invalido.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("rugs")
      .update({
        photographed_on_entry: isChecked(formData, "photographedOnEntry"),
        condition_reviewed: isChecked(formData, "conditionReviewed"),
        cleaning_completed: isChecked(formData, "cleaningCompleted"),
        stored_correctly: isChecked(formData, "storedCorrectly"),
        ready_for_exit: isChecked(formData, "readyForExit"),
      })
      .eq("id", parsed.data.rugId);

    if (error) {
      return {
        status: "error",
        message: "No se pudo guardar el checklist.",
      };
    }

    revalidatePath(`/rugs/${parsed.data.rugId}`);

    return {
      status: "success",
      message: "Checklist actualizado.",
    };
  } catch {
    return {
      status: "error",
      message: "No se pudo guardar el checklist.",
    };
  }
}
