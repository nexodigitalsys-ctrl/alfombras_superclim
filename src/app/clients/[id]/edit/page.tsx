import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { ClientForm } from "@/features/clients/components/client-form";
import { getClientById } from "@/features/clients/queries/get-client-by-id";

type EditClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const { id } = await params;
  const { data: client } = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Modulo clientes
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Editar cliente
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Actualiza los datos del cliente sin mezclar aun informacion de alfombras.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <ClientForm client={client} />
        </section>
      </section>
    </AppShell>
  );
}
