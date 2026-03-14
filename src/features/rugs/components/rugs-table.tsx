import Link from "next/link";

import type { RugListItem } from "@/features/rugs/types/rug";
import { cn } from "@/lib/utils/cn";

type RugsTableProps = {
  rugs: RugListItem[];
};

export function RugsTable({ rugs }: RugsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Codigo</th>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Tipo</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Ubicacion</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rugs.map((rug) => (
              <tr key={rug.id} className="text-sm text-slate-700">
                <td className="px-5 py-4 font-semibold text-slate-950">{rug.code}</td>
                <td className="px-5 py-4">{rug.client?.full_name ?? "Sin cliente"}</td>
                <td className="px-5 py-4">{rug.type}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                      rug.current_status === "stored" || rug.current_status === "ready_to_store"
                        ? "bg-emerald-100 text-emerald-800"
                        : rug.current_status === "delivered"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-amber-100 text-amber-800",
                    )}
                  >
                    {rug.current_status}
                  </span>
                </td>
                <td className="px-5 py-4">{rug.location?.label ?? "Sin asignar"}</td>
                <td className="px-5 py-4">{rug.total_price.toFixed(2)} EUR</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/rugs/${rug.id}`}
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/rugs/${rug.id}/edit`}
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
