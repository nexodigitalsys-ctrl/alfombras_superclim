import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/features/clients/components/empty-state";
import { LocationFilters } from "@/features/locations/components/location-filters";
import { LocationsTable } from "@/features/locations/components/locations-table";
import { getLocations } from "@/features/locations/queries/get-locations";

type LocationsPageProps = {
  searchParams: Promise<{
    q?: string;
    zone?: string;
    occupancy?: "all" | "occupied" | "free";
  }>;
};

export default async function LocationsPage({
  searchParams,
}: LocationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.q?.trim() ?? "";
  const zone = resolvedSearchParams.zone?.trim().toUpperCase() ?? "";
  const occupancy = resolvedSearchParams.occupancy ?? "all";

  const { data: locations, error } = await getLocations({
    searchTerm,
    zone,
    occupancy,
  });

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Modulo ubicaciones
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Ubicaciones
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                Gestion de posiciones fisicas del almacen con filtros y control de ocupacion.
              </p>
            </div>
          </div>

          <Link
            href="/locations/new"
            className="inline-flex rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Nueva ubicacion
          </Link>
        </div>

        <LocationFilters
          defaultSearchTerm={searchTerm}
          defaultZone={zone}
          defaultOccupancy={occupancy}
        />

        {error ? (
          <EmptyState
            title="No se pudieron cargar las ubicaciones"
            description={error}
          />
        ) : locations.length === 0 ? (
          <EmptyState
            title={searchTerm || zone || occupancy !== "all" ? "Sin resultados" : "Aun no hay ubicaciones"}
            description={
              searchTerm || zone || occupancy !== "all"
                ? "No encontramos ubicaciones con los filtros indicados."
                : "Crea la primera ubicacion para empezar a estructurar el almacen."
            }
            actionLabel={
              searchTerm || zone || occupancy !== "all"
                ? undefined
                : "Crear ubicacion"
            }
            actionHref={
              searchTerm || zone || occupancy !== "all"
                ? undefined
                : "/locations/new"
            }
          />
        ) : (
          <LocationsTable locations={locations} />
        )}
      </section>
    </AppShell>
  );
}
