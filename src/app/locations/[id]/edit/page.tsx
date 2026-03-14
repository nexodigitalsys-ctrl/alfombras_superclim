import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { LocationForm } from "@/features/locations/components/location-form";
import { getLocationById } from "@/features/locations/queries/get-location-by-id";

type EditLocationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { id } = await params;
  const { data: location } = await getLocationById(id);

  if (!location) {
    notFound();
  }

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Modulo ubicaciones
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Editar ubicacion
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Ajusta la posicion fisica manteniendo la unicidad logica del almacen.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <LocationForm location={location} />
        </section>
      </section>
    </AppShell>
  );
}
