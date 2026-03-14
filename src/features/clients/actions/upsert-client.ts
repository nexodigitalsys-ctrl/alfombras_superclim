"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clientSchema } from "@/features/clients/schemas/client-schema";
import type { ClientFormState } from "@/features/clients/types/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const initialState: ClientFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

function normalizeOptionalValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function upsertClientAction(
  _previousState: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const clientId = normalizeOptionalValue(formData.get("id"));

  const parsed = clientSchema.safeParse({
    fullName: normalizeOptionalValue(formData.get("fullName")),
    phone: normalizeOptionalValue(formData.get("phone")),
    email: normalizeOptionalValue(formData.get("email")),
    address: normalizeOptionalValue(formData.get("address")),
    notes: normalizeOptionalValue(formData.get("notes")),
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
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      notes: parsed.data.notes || null,
    };

    if (clientId) {
      const { error } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", clientId);

      if (error) {
        return {
          status: "error",
          message: "No se pudo actualizar el cliente.",
          fieldErrors: {},
        };
      }

      revalidatePath("/clients");
      revalidatePath(`/clients/${clientId}`);
      revalidatePath(`/clients/${clientId}/edit`);
      redirect(`/clients/${clientId}`);
    }

    const { data, error } = await supabase
      .from("clients")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      return {
        status: "error",
        message: "No se pudo crear el cliente.",
        fieldErrors: {},
      };
    }

    revalidatePath("/clients");
    redirect(`/clients/${data.id}`);
  } catch {
    return {
      status: "error",
      message: "No se pudo guardar el cliente. Revisa la conexion con Supabase.",
      fieldErrors: {},
    };
  }

  return initialState;
}

export const clientFormInitialState = initialState;
