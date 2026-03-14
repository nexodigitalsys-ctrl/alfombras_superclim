import type { RugListItem } from "@/features/rugs/types/rug";

type RugReceiptDocumentProps = {
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

function formatMoney(value: number): string {
  return `${value.toFixed(2)} EUR`;
}

export function RugReceiptDocument({ rug }: RugReceiptDocumentProps) {
  return (
    <article className="print-shell mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-10">
      <header className="print-card rounded-[1.75rem] bg-slate-950 px-6 py-8 text-slate-50 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">
              Superclim Servicios
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Recibo de Entrada de Alfombra
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Documento operativo de recepcion, servicio y custodia interna.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm">
            <p className="text-slate-400">Referencia</p>
            <p className="mt-1 text-lg font-semibold text-white">{rug.code}</p>
          </div>
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="print-card rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Datos del cliente</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Nombre
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.client?.full_name ?? "Sin cliente"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Telefono
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.client?.phone ?? "No informado"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.client?.email ?? "No informado"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Direccion
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.client?.address ?? "No informada"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="print-card rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Datos de la alfombra</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tipo
                </dt>
                <dd className="mt-2 text-sm text-slate-700">{rug.type}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Medidas
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.width_cm} x {rug.length_cm} cm
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Categoria
                </dt>
                <dd className="mt-2 text-sm text-slate-700">{rug.size_category}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Color principal
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.primary_color ?? "No especificado"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Estado de entrada
                </dt>
                <dd className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {rug.condition_in ?? "Sin observaciones de estado."}
                </dd>
              </div>
            </dl>
          </section>

          <section className="print-card rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Servicio y observaciones</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Servicio contratado
                </dt>
                <dd className="mt-2 text-sm text-slate-700">{rug.service_type}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Estado actual
                </dt>
                <dd className="mt-2 text-sm text-slate-700">{rug.current_status}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Limpieza
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.includes_cleaning ? "Incluida" : "No incluida"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Entrega
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.includes_delivery ? "Incluida" : "No incluida"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Observaciones
                </dt>
                <dd className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {rug.notes ?? "Sin observaciones adicionales."}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className="print-card rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Fechas y ubicacion</h2>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Entrada
                </dt>
                <dd className="mt-2 text-sm text-slate-700">{formatDate(rug.entry_date)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Salida prevista
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {formatDate(rug.expected_exit_date)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Salida real
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {formatDate(rug.actual_exit_date)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Ubicacion interna
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  {rug.location?.label ?? "Pendiente de asignacion"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="print-card rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Resumen economico</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Base</span>
                <span>{formatMoney(rug.base_price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Almacenamiento</span>
                <span>{formatMoney(rug.storage_price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Extras</span>
                <span>{formatMoney(rug.extra_price)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                  <span>Total</span>
                  <span>{formatMoney(rug.total_price)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="print-card rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Firma</h2>
            <div className="mt-10 space-y-6">
              <div>
                <div className="h-px w-full bg-slate-300" />
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Cliente / Representante
                </p>
              </div>
              <div>
                <div className="h-px w-full bg-slate-300" />
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Superclim Servicios
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}
