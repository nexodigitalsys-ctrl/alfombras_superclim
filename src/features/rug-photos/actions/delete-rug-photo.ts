"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const deleteRugPhotoSchema = z.object({
  rugId: z.string().uuid(),
  photoId: z.string().uuid(),
});

export async function deleteRugPhotoAction(formData: FormData): Promise<void> {
  const parsed = deleteRugPhotoSchema.safeParse({
    rugId: formData.get("rugId"),
    photoId: formData.get("photoId"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { data: photo } = await supabase
    .from("rug_photos")
    .select("storage_path")
    .eq("id", parsed.data.photoId)
    .eq("rug_id", parsed.data.rugId)
    .maybeSingle();

  if (!photo) {
    return;
  }

  await supabase.storage.from("rug-photos").remove([photo.storage_path]);
  await supabase
    .from("rug_photos")
    .delete()
    .eq("id", parsed.data.photoId)
    .eq("rug_id", parsed.data.rugId);

  revalidatePath(`/rugs/${parsed.data.rugId}`);
}
