import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { RugPhotoItem } from "@/features/rug-photos/types/rug-photo";

type GetRugPhotosResult = {
  data: RugPhotoItem[];
  error: string | null;
};

export async function getRugPhotos(rugId: string): Promise<GetRugPhotosResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("rug_photos")
      .select("*")
      .eq("rug_id", rugId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        data: [],
        error: "No se pudieron cargar las fotos.",
      };
    }

    const photos = (data ?? []).map((photo) => {
      const { data: publicUrlData } = supabase.storage
        .from("rug-photos")
        .getPublicUrl(photo.storage_path);

      return {
        ...photo,
        publicUrl: publicUrlData.publicUrl,
      };
    });

    return {
      data: photos,
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "No se pudieron cargar las fotos.",
    };
  }
}
