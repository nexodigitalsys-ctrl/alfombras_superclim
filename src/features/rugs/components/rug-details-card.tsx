import type { RugListItem } from "@/features/rugs/types/rug";

type RugDetailsCardProps = {
  rug: RugListItem;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function RugDetailsCard({ rug }: RugDetailsCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Codigo
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">{rug.code}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Cliente
          </p>
          <p className="mt-2 text-base text-slate-700">
            {rug.client?.full_name ?? "Sin cliente"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ubicacion
          </p>
          <p className="mt-2 text-base text-slate-700">
            {rug.location?.label ?? "Sin asignar"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Tipo
          </p>
          <p className="mt-2 text-base text-slate-700">{rug.type}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Tamano
          </p>
          <p className="mt-2 text-base text-slate-700">
            {rug.width_cm} x {rug.length_cm} cm ({rug.size_category})
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Estado
          </p>
          <p className="mt-2 text-base text-slate-700">{rug.current_status}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Servicio
          </p>
          <p className="mt-2 text-base text-slate-700">{rug.service_type}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Entrada
          </p>
          <p className="mt-2 text-base text-slate-700">{formatDate(rug.entry_date)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Salida prevista
          </p>
          <p className="mt-2 text-base text-slate-700">
            {formatDate(rug.expected_exit_date)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Salida real
          </p>
          <p className="mt-2 text-base text-slate-700">
            {formatDate(rug.actual_exit_date)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Precio total
          </p>
          <p className="mt-2 text-base text-slate-700">{rug.total_price.toFixed(2)} EUR</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Extras
          </p>
          <p className="mt-2 text-base text-slate-700">
            Limpieza: {rug.includes_cleaning ? "Si" : "No"} | Entrega:{" "}
            {rug.includes_delivery ? "Si" : "No"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t border-slate-200 pt-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Estado de entrada
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {rug.condition_in || "Sin descripcion."}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Observaciones
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {rug.notes || "Sin notas."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Fotos preparadas para siguiente etapa. Actualmente se conserva el campo `photos` en el modelo.
      </div>
    </section>
  );
}
