import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { StorageLocation } from "@/features/locations/types/location";

type GetLocationsFilters = {
  searchTerm?: string;
  occupancy?: "all" | "occupied" | "free";
  zone?: string;
};

type GetLocationsResult =
  | {
      data: StorageLocation[];
      error: null;
    }
  | {
      data: StorageLocation[];
      error: string;
    };

export async function getLocations(
  filters: GetLocationsFilters,
): Promise<GetLocationsResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const searchTerm = filters.searchTerm?.trim();
    const zone = filters.zone?.trim().toUpperCase();

    let query = supabase
      .from("storage_locations")
      .select("*")
      .order("zone", { ascending: true })
      .order("rack", { ascending: true })
      .order("level", { ascending: true })
      .order("position", { ascending: true });

    if (searchTerm) {
      const escapedTerm = searchTerm.replace(/[%_]/g, "\\$&");
      query = query.or(
        `label.ilike.%${escapedTerm}%,zone.ilike.%${escapedTerm}%,rack.ilike.%${escapedTerm}%,level.ilike.%${escapedTerm}%,position.ilike.%${escapedTerm}%`,
      );
    }

    if (zone) {
      query = query.eq("zone", zone);
    }

    if (filters.occupancy === "occupied") {
      query = query.eq("is_occupied", true);
    }

    if (filters.occupancy === "free") {
      query = query.eq("is_occupied", false);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: "No se pudieron cargar las ubicaciones.",
      };
    }

    return {
      data: data as StorageLocation[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "Falta la configuracion de Supabase o no se pudo conectar.",
    };
  }
}
