import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { RugMovementForm } from "@/features/movements/components/rug-movement-form";
import { RugMovementTimeline } from "@/features/movements/components/rug-movement-timeline";
import { getRugMovements } from "@/features/movements/queries/get-rug-movements";
import { RugDetailsCard } from "@/features/rugs/components/rug-details-card";
import { getRugFormOptions } from "@/features/rugs/queries/get-rug-form-options";
import { getRugById } from "@/features/rugs/queries/get-rug-by-id";

type RugDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RugDetailPage({ params }: RugDetailPageProps) {
  const { id } = await params;
  const { data: rug, error } = await getRugById(id);

  if (!rug) {
    notFound();
  }

  const [{ data: movements }, options] = await Promise.all([
    getRugMovements(id),
    getRugFormOptions(rug.storage_location_id),
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
                {rug.code}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Vista principal de la alfombra para operacion diaria y seguimiento.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/rugs"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Volver
            </Link>
            <Link
              href={`/rugs/${rug.id}/edit`}
              className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
            >
              Editar alfombra
            </Link>
            <Link
              href={`/rugs/${rug.id}/receipt`}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Ver recibo
            </Link>
          </div>
        </div>

        {error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
            {error}
          </section>
        ) : null}

        <RugDetailsCard rug={rug} />
        <RugMovementForm
          rug={rug}
          availableLocations={options.locations.map((location) => ({
            id: location.id,
            label: location.label,
          }))}
        />
        <RugMovementTimeline movements={movements} />
      </section>
    </AppShell>
  );
}
