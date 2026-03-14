import { z } from "zod";

import { rugStatuses, serviceTypes, sizeCategories } from "@/types/domain";

function optionalTrimmedString(maxLength: number) {
  return z.string().trim().max(maxLength, `Maximo ${maxLength} caracteres.`);
}

function moneyField(label: string) {
  return z.coerce
    .number()
    .min(0, `${label} no puede ser negativo.`)
    .max(999999, `${label} es demasiado alto.`);
}

export const rugSchema = z
  .object({
    clientId: z.string().uuid("Selecciona un cliente valido."),
    type: z
      .string()
      .trim()
      .min(2, "El tipo debe tener al menos 2 caracteres.")
      .max(120, "El tipo es demasiado largo."),
    widthCm: z.coerce.number().int().positive("El ancho debe ser mayor que 0."),
    lengthCm: z.coerce
      .number()
      .int()
      .positive("El largo debe ser mayor que 0."),
    sizeCategory: z.enum(sizeCategories, {
      error: "Selecciona una categoria de tamano valida.",
    }),
    primaryColor: optionalTrimmedString(80),
    conditionIn: optionalTrimmedString(500),
    currentStatus: z.enum(rugStatuses, {
      error: "Selecciona un estado valido.",
    }),
    storageLocationId: z.union([z.literal(""), z.string().uuid()]),
    entryDate: z.string().date("La fecha de entrada no es valida."),
    expectedExitDate: z.union([z.literal(""), z.string().date()]),
    actualExitDate: z.union([z.literal(""), z.string().date()]),
    serviceType: z.enum(serviceTypes, {
      error: "Selecciona un tipo de servicio valido.",
    }),
    includesCleaning: z.boolean(),
    includesDelivery: z.boolean(),
    basePrice: moneyField("El precio base"),
    storagePrice: moneyField("El precio de almacenamiento"),
    extraPrice: moneyField("El precio extra"),
    totalPrice: moneyField("El precio total"),
    notes: optionalTrimmedString(1000),
  })
  .superRefine((values, context) => {
    if (values.expectedExitDate && values.expectedExitDate < values.entryDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expectedExitDate"],
        message: "La salida prevista no puede ser anterior a la entrada.",
      });
    }

    if (values.actualExitDate && values.actualExitDate < values.entryDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["actualExitDate"],
        message: "La salida real no puede ser anterior a la entrada.",
      });
    }
  });

export type RugSchema = z.infer<typeof rugSchema>;
