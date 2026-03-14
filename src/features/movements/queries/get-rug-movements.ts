import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { RugMovement } from "@/features/movements/types/movement";

type GetRugMovementsResult =
  | {
      data: RugMovement[];
      error: null;
    }
  | {
      data: RugMovement[];
      error: string;
    };

export async function getRugMovements(
  rugId: string,
): Promise<GetRugMovementsResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("rug_movements")
      .select(
        `
          *,
          from_location:storage_locations!rug_movements_from_location_id_fkey(id, label),
          to_location:storage_locations!rug_movements_to_location_id_fkey(id, label)
        `,
      )
      .eq("rug_id", rugId)
      .order("moved_at", { ascending: false });

    if (error) {
      return {
        data: [],
        error: "No se pudo cargar el historial de movimientos.",
      };
    }

    return {
      data: data as unknown as RugMovement[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "No se pudo cargar el historial de movimientos.",
    };
  }
}
