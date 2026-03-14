import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { StorageLocation } from "@/features/locations/types/location";

type GetLocationByIdResult =
  | {
      data: StorageLocation;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export async function getLocationById(
  id: string,
): Promise<GetLocationByIdResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("storage_locations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return {
        data: null,
        error: "Ubicacion no encontrada.",
      };
    }

    return {
      data: data as StorageLocation,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "No se pudo cargar la ubicacion.",
    };
  }
}
