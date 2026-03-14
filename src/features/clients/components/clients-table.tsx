import Link from "next/link";

import type { Client } from "@/features/clients/types/client";

type ClientsTableProps = {
  clients: Client[];
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Telefono</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Alta</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="text-sm text-slate-700">
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-950">
                    {client.full_name}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {client.address || "Sin direccion"}
                  </div>
                </td>
                <td className="px-5 py-4">{client.phone}</td>
                <td className="px-5 py-4">{client.email || "Sin email"}</td>
                <td className="px-5 py-4">{formatDate(client.created_at)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/clients/${client.id}/edit`}
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
