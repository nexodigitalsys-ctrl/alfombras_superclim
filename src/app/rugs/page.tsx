import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/features/clients/components/empty-state";
import { RugFilters } from "@/features/rugs/components/rug-filters";
import { RugsTable } from "@/features/rugs/components/rugs-table";
import { getRugFormOptions } from "@/features/rugs/queries/get-rug-form-options";
import { getRugs } from "@/features/rugs/queries/get-rugs";

type RugsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    clientId?: string;
  }>;
};

export default async function RugsPage({ searchParams }: RugsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.q?.trim() ?? "";
  const status = resolvedSearchParams.status?.trim() ?? "";
  const clientId = resolvedSearchParams.clientId?.trim() ?? "";

  const [{ data: rugs, error }, options] = await Promise.all([
    getRugs({ searchTerm, status, clientId }),
    getRugFormOptions(),
  ]);

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Modulo alfombras
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Alfombras
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                Registro principal de piezas con cliente, ubicacion, estado, fechas y precio.
              </p>
            </div>
          </div>

          <Link
            href="/rugs/new"
            className="inline-flex rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Nueva alfombra
          </Link>
        </div>

        <RugFilters
          defaultSearchTerm={searchTerm}
          defaultStatus={status}
          defaultClientId={clientId}
          clients={options.clients}
        />

        {error ? (
          <EmptyState
            title="No se pudieron cargar las alfombras"
            description={error}
          />
        ) : rugs.length === 0 ? (
          <EmptyState
            title={searchTerm || status || clientId ? "Sin resultados" : "Aun no hay alfombras"}
            description={
              searchTerm || status || clientId
                ? "No encontramos alfombras con los filtros indicados."
                : "Crea la primera alfombra para empezar a operar el flujo principal."
            }
            actionLabel={
              searchTerm || status || clientId ? undefined : "Crear alfombra"
            }
            actionHref={searchTerm || status || clientId ? undefined : "/rugs/new"}
          />
        ) : (
          <RugsTable rugs={rugs} />
        )}
      </section>
    </AppShell>
  );
}
