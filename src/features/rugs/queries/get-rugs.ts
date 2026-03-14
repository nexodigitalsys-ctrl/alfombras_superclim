import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { RugListItem } from "@/features/rugs/types/rug";
import { rugStatuses, type RugStatus } from "@/types/domain";

type GetRugsFilters = {
  searchTerm?: string;
  status?: string;
  clientId?: string;
};

type GetRugsResult =
  | {
      data: RugListItem[];
      error: null;
    }
  | {
      data: RugListItem[];
      error: string;
    };

export async function getRugs(
  filters: GetRugsFilters,
): Promise<GetRugsResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const searchTerm = filters.searchTerm?.trim();
    const rawStatus = filters.status?.trim();
    const status = rawStatus && rugStatuses.includes(rawStatus as RugStatus)
      ? (rawStatus as RugStatus)
      : undefined;
    const clientId = filters.clientId?.trim();

    let query = supabase
      .from("rugs")
      .select(
        `
          *,
          client:clients(id, full_name),
          location:storage_locations(id, label)
        `,
      )
      .order("created_at", { ascending: false });

    if (searchTerm) {
      const escapedTerm = searchTerm.replace(/[%_]/g, "\\$&");
      query = query.or(
        `code.ilike.%${escapedTerm}%,type.ilike.%${escapedTerm}%,primary_color.ilike.%${escapedTerm}%`,
      );
    }

    if (status) {
      query = query.eq("current_status", status);
    }

    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: "No se pudieron cargar las alfombras.",
      };
    }

    return {
      data: data as unknown as RugListItem[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "Falta la configuracion de Supabase o no se pudo conectar.",
    };
  }
}
