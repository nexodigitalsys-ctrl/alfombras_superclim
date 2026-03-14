import { z } from "zod";

import { rugPhotoCategories } from "@/types/domain";

const maxFileSize = 5 * 1024 * 1024;
const acceptedMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export const rugPhotoUploadSchema = z.object({
  rugId: z.string().uuid("Alfombra invalida."),
  category: z.enum(rugPhotoCategories, {
    error: "Seleciona una categoria valida.",
  }),
  caption: z
    .string()
    .trim()
    .max(160, "La observacion no puede superar 160 caracteres.")
    .optional()
    .transform((value) => value ?? ""),
});

export function validatePhotoFile(file: File | null): string[] | undefined {
  if (!file || file.size === 0) {
    return ["Seleciona una imagen."];
  }

  if (!acceptedMimeTypes.includes(file.type as (typeof acceptedMimeTypes)[number])) {
    return ["Formato no permitido. Usa JPG, PNG o WEBP."];
  }

  if (file.size > maxFileSize) {
    return ["La imagen no puede superar 5 MB."];
  }

  return undefined;
}
