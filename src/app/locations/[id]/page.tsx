import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { LocationDetailsCard } from "@/features/locations/components/location-details-card";
import { getLocationById } from "@/features/locations/queries/get-location-by-id";

type LocationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LocationDetailPage({
  params,
}: LocationDetailPageProps) {
  const { id } = await params;
  const { data: location, error } = await getLocationById(id);

  if (!location) {
    notFound();
  }

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
                {location.label}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Detalle de la posicion fisica y estado actual de ocupacion.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/locations"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Volver
            </Link>
            <Link
              href={`/locations/${location.id}/edit`}
              className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
            >
              Editar ubicacion
            </Link>
          </div>
        </div>

        {error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
            {error}
          </section>
        ) : null}

        <LocationDetailsCard location={location} />
      </section>
    </AppShell>
  );
}
