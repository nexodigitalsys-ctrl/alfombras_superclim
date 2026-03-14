import type { Client } from "@/features/clients/types/client";

type ClientDetailsCardProps = {
  client: Client;
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Nombre completo
          </p>
          <p className="mt-2 text-base font-medium text-slate-950">
            {client.full_name}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Telefono
          </p>
          <p className="mt-2 text-base text-slate-700">{client.phone}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Email
          </p>
          <p className="mt-2 text-base text-slate-700">
            {client.email || "Sin email"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Direccion
          </p>
          <p className="mt-2 text-base text-slate-700">
            {client.address || "Sin direccion"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Creado
          </p>
          <p className="mt-2 text-base text-slate-700">
            {formatDateTime(client.created_at)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ultima actualizacion
          </p>
          <p className="mt-2 text-base text-slate-700">
            {formatDateTime(client.updated_at)}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Notas
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {client.notes || "Sin notas registradas."}
        </p>
      </div>
    </section>
  );
}
