"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  rugPhotoUploadSchema,
  validatePhotoFile,
} from "@/features/rug-photos/schemas/rug-photo-schema";
import type { RugPhotoUploadState } from "@/features/rug-photos/types/rug-photo";

function buildStoragePath(rugId: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  return `${rugId}/${Date.now()}-${safeName}`;
}

export async function uploadRugPhotoAction(
  _previousState: RugPhotoUploadState,
  formData: FormData,
): Promise<RugPhotoUploadState> {
  const parsed = rugPhotoUploadSchema.safeParse({
    rugId: formData.get("rugId"),
    category: formData.get("category"),
    caption: formData.get("caption"),
  });

  const file = formData.get("photo");
  const photo = file instanceof File ? file : null;
  const fileErrors = validatePhotoFile(photo);

  if (!parsed.success || fileErrors) {
    return {
      status: "error",
      message: "Revisa los datos de la foto.",
      fieldErrors: {
        ...(parsed.success ? {} : parsed.error.flatten().fieldErrors),
        ...(fileErrors ? { photo: fileErrors } : {}),
      },
    };
  }

  if (!photo) {
    return {
      status: "error",
      message: "Seleciona una imagen.",
      fieldErrors: {
        photo: ["Seleciona una imagen."],
      },
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const path = buildStoragePath(parsed.data.rugId, photo.name);

    const { error: uploadError } = await supabase.storage
      .from("rug-photos")
      .upload(path, photo, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        status: "error",
        message: "No se pudo subir la foto.",
        fieldErrors: {},
      };
    }

    const { error: insertError } = await supabase.from("rug_photos").insert({
      rug_id: parsed.data.rugId,
      storage_path: path,
      category: parsed.data.category,
      caption: parsed.data.caption || null,
    });

    if (insertError) {
      await supabase.storage.from("rug-photos").remove([path]);

      return {
        status: "error",
        message: "No se pudo vincular la foto a la alfombra.",
        fieldErrors: {},
      };
    }

    revalidatePath(`/rugs/${parsed.data.rugId}`);

    return {
      status: "success",
      message: "Foto subida correctamente.",
      fieldErrors: {},
    };
  } catch {
    return {
      status: "error",
      message: "No se pudo subir la foto.",
      fieldErrors: {},
    };
  }
}
