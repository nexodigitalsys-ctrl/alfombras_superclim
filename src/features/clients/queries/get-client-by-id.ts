import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { Client } from "@/features/clients/types/client";

type GetClientByIdResult =
  | {
      data: Client;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export async function getClientById(id: string): Promise<GetClientByIdResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return {
        data: null,
        error: "Cliente no encontrado.",
      };
    }

    return {
      data: data as Client,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "No se pudo cargar el cliente.",
    };
  }
}
