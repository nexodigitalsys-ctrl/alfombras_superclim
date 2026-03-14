import { z } from "zod";

import { serviceTypes, sizeCategories } from "@/types/domain";

function moneyField(label: string) {
  return z.coerce
    .number()
    .min(0, `${label} no puede ser negativo.`)
    .max(999999, `${label} es demasiado alto.`);
}

export const pricingRuleSchema = z.object({
  serviceType: z.enum(serviceTypes, {
    error: "Selecciona un tipo de servicio valido.",
  }),
  sizeCategory: z.enum(sizeCategories, {
    error: "Selecciona una categoria valida.",
  }),
  basePrice: moneyField("El precio base"),
  pricePerM2: moneyField("El precio por m2"),
  storageDailyPrice: moneyField("El precio diario de almacenamiento"),
  cleaningPrice: moneyField("El precio de limpieza"),
  deliveryPrice: moneyField("El precio de entrega"),
  extraPrice: moneyField("El precio extra"),
  isActive: z.boolean(),
});

export type PricingRuleSchema = z.infer<typeof pricingRuleSchema>;
