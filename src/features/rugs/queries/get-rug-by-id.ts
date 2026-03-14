import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { RugListItem } from "@/features/rugs/types/rug";

type GetRugByIdResult =
  | {
      data: RugListItem;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export async function getRugById(id: string): Promise<GetRugByIdResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("rugs")
      .select(
        `
          *,
          client:clients(id, full_name, phone, email, address),
          location:storage_locations(id, label)
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return {
        data: null,
        error: "Alfombra no encontrada.",
      };
    }

    return {
      data: data as unknown as RugListItem,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "No se pudo cargar la alfombra.",
    };
  }
}
