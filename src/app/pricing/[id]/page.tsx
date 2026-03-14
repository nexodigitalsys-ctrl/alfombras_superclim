import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { PricingRuleDetailsCard } from "@/features/pricing/components/pricing-rule-details-card";
import { getPricingRuleById } from "@/features/pricing/queries/get-pricing-rule-by-id";

type PricingRulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PricingRulePage({ params }: PricingRulePageProps) {
  const { id } = await params;
  const { data: rule } = await getPricingRuleById(id);

  if (!rule) {
    notFound();
  }

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
                {rule.service_type} / {rule.size_category}
              </h1>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/pricing" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              Volver
            </Link>
            <Link href={`/pricing/${rule.id}/edit`} className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800">
              Editar regla
            </Link>
          </div>
        </div>

        <PricingRuleDetailsCard rule={rule} />
      </section>
    </AppShell>
  );
}
