import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/features/clients/components/empty-state";
import { PricingRulesTable } from "@/features/pricing/components/pricing-rules-table";
import { getPricingRules } from "@/features/pricing/queries/get-pricing-rules";

export default async function PricingPage() {
  const { data: rules, error } = await getPricingRules();

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Modulo precios
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Reglas de precio
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                Configuracion simple de reglas por servicio y tamano para el calculo automatico.
              </p>
            </div>
          </div>

          <Link
            href="/pricing/new"
            className="inline-flex rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Nueva regla
          </Link>
        </div>

        {error ? (
          <EmptyState title="No se pudieron cargar las reglas" description={error} />
        ) : rules.length === 0 ? (
          <EmptyState
            title="Aun no hay reglas de precio"
            description="Crea la primera regla activa para empezar a calcular precios automaticamente."
            actionLabel="Crear regla"
            actionHref="/pricing/new"
          />
        ) : (
          <PricingRulesTable rules={rules} />
        )}
      </section>
    </AppShell>
  );
}
