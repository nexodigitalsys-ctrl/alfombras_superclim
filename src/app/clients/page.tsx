import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { ClientSearch } from "@/features/clients/components/client-search";
import { ClientsTable } from "@/features/clients/components/clients-table";
import { EmptyState } from "@/features/clients/components/empty-state";
import { getClients } from "@/features/clients/queries/get-clients";

type ClientsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.q?.trim() ?? "";
  const { data: clients, error } = await getClients(searchTerm);

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Modulo clientes
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Clientes
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                Gestion basica de clientes con busqueda, alta, edicion y detalle.
              </p>
            </div>
          </div>

          <Link
            href="/clients/new"
            className="inline-flex rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Nuevo cliente
          </Link>
        </div>

        <ClientSearch defaultValue={searchTerm} />

        {error ? (
          <EmptyState
            title="No se pudieron cargar los clientes"
            description={error}
          />
        ) : clients.length === 0 ? (
          <EmptyState
            title={searchTerm ? "Sin resultados" : "Aun no hay clientes"}
            description={
              searchTerm
                ? "No encontramos clientes con ese criterio de busqueda."
                : "Crea el primer cliente para empezar a usar el modulo."
            }
            actionLabel={searchTerm ? undefined : "Crear cliente"}
            actionHref={searchTerm ? undefined : "/clients/new"}
          />
        ) : (
          <ClientsTable clients={clients} />
        )}
      </section>
    </AppShell>
  );
}
