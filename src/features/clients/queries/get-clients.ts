import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { Client } from "@/features/clients/types/client";

type GetClientsResult =
  | {
      data: Client[];
      error: null;
    }
  | {
      data: Client[];
      error: string;
    };

export async function getClients(searchTerm?: string): Promise<GetClientsResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const normalizedTerm = searchTerm?.trim();

    let query = supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (normalizedTerm) {
      const escapedTerm = normalizedTerm.replace(/[%_]/g, "\\$&");
      query = query.or(
        `full_name.ilike.%${escapedTerm}%,phone.ilike.%${escapedTerm}%,email.ilike.%${escapedTerm}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: "No se pudieron cargar los clientes.",
      };
    }

    return {
      data: data as Client[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "Falta la configuracion de Supabase o no se pudo conectar.",
    };
  }
}
