import { z } from "zod";

function normalizedSegmentSchema(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(10, `${label} es demasiado largo.`);
}

export const locationSchema = z.object({
  zone: normalizedSegmentSchema("La zona").transform((value) =>
    value.toUpperCase(),
  ),
  rack: normalizedSegmentSchema("La estanteria"),
  level: normalizedSegmentSchema("El nivel"),
  position: normalizedSegmentSchema("La posicion"),
  isOccupied: z.boolean(),
});

export type LocationSchema = z.infer<typeof locationSchema>;

export function buildLocationLabel(
  zone: string,
  rack: string,
  level: string,
  position: string,
): string {
  return [
    zone.trim().toUpperCase(),
    rack.trim().padStart(2, "0"),
    level.trim().padStart(2, "0"),
    position.trim().padStart(2, "0"),
  ].join("-");
}
