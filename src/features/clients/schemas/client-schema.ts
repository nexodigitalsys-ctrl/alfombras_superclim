import { z } from "zod";

export const clientSchema = z.object({
  fullName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(120, "El nombre es demasiado largo."),
  phone: z.string().trim().min(6, "El telefono debe tener al menos 6 caracteres.").max(30, "El telefono es demasiado largo."),
  email: z.union([
    z.literal(""),
    z.string().trim().email("El email no es valido.").max(120, "El email es demasiado largo."),
  ]),
  address: z.string().trim().max(240, "La direccion es demasiado larga."),
  notes: z.string().trim().max(1000, "Las notas son demasiado largas."),
});

export type ClientSchema = z.infer<typeof clientSchema>;
