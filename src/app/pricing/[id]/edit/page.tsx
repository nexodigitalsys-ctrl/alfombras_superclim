import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { PricingRuleForm } from "@/features/pricing/components/pricing-rule-form";
import { getPricingRuleById } from "@/features/pricing/queries/get-pricing-rule-by-id";

type EditPricingRulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPricingRulePage({
  params,
}: EditPricingRulePageProps) {
  const { id } = await params;
  const { data: rule } = await getPricingRuleById(id);

  if (!rule) {
    notFound();
  }

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Modulo precios
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Editar regla de precio
            </h1>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <PricingRuleForm rule={rule} />
        </section>
      </section>
    </AppShell>
  );
}
