import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/features/clients/components/empty-state";
import { RugForm } from "@/features/rugs/components/rug-form";
import { getRugFormOptions } from "@/features/rugs/queries/get-rug-form-options";

export default async function NewRugPage() {
  const options = await getRugFormOptions();

  if (options.clients.length === 0) {
    return (
      <AppShell>
        <EmptyState
          title="Necesitas clientes para crear una alfombra"
          description="Crea primero al menos un cliente y luego vuelve a este formulario."
          actionLabel="Ir a clientes"
          actionHref="/clients"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Modulo alfombras
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Nueva alfombra
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Alta rapida con codigo automatico, cliente, ubicacion, estado y precios.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <RugForm options={options} />
        </section>
      </section>
    </AppShell>
  );
}
