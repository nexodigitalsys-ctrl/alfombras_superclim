import Link from "next/link";

import type { StorageLocation } from "@/features/locations/types/location";
import { cn } from "@/lib/utils/cn";

type LocationsTableProps = {
  locations: StorageLocation[];
};

export function LocationsTable({ locations }: LocationsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Label</th>
              <th className="px-5 py-4">Zona</th>
              <th className="px-5 py-4">Rack</th>
              <th className="px-5 py-4">Nivel</th>
              <th className="px-5 py-4">Posicion</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locations.map((location) => (
              <tr key={location.id} className="text-sm text-slate-700">
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {location.label}
                </td>
                <td className="px-5 py-4">{location.zone}</td>
                <td className="px-5 py-4">{location.rack}</td>
                <td className="px-5 py-4">{location.level}</td>
                <td className="px-5 py-4">{location.position}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                      location.is_occupied
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {location.is_occupied ? "Ocupada" : "Libre"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/locations/${location.id}`}
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/locations/${location.id}/edit`}
                      className="text-sm font-medium text-slate-700 hover:text-slate-950"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
