import { AppShell } from "@/components/layout/app-shell";
import { ClientForm } from "@/features/clients/components/client-form";

export default function NewClientPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Modulo clientes
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Nuevo cliente
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Alta manual de un cliente para futuras vinculaciones con alfombras.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <ClientForm />
        </section>
      </section>
    </AppShell>
  );
}
