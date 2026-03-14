import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { RugForm } from "@/features/rugs/components/rug-form";
import { getRugById } from "@/features/rugs/queries/get-rug-by-id";
import { getRugFormOptions } from "@/features/rugs/queries/get-rug-form-options";

type EditRugPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRugPage({ params }: EditRugPageProps) {
  const { id } = await params;
  const { data: rug } = await getRugById(id);

  if (!rug) {
    notFound();
  }

  const options = await getRugFormOptions(rug.storage_location_id);

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Modulo alfombras
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Editar alfombra
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Ajusta cliente, ubicacion, estado, fechas y precios de la pieza.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <RugForm rug={rug} options={options} />
        </section>
      </section>
    </AppShell>
  );
}
