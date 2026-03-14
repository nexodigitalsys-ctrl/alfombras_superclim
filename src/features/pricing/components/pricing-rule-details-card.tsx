import type { PricingRule } from "@/features/pricing/types/pricing-rule";

type PricingRuleDetailsCardProps = {
  rule: PricingRule;
};

export function PricingRuleDetailsCard({
  rule,
}: PricingRuleDetailsCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Servicio</p><p className="mt-2 text-base text-slate-700">{rule.service_type}</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tamano</p><p className="mt-2 text-base text-slate-700">{rule.size_category}</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Estado</p><p className="mt-2 text-base text-slate-700">{rule.is_active ? "Activa" : "Inactiva"}</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Base</p><p className="mt-2 text-base text-slate-700">{rule.base_price.toFixed(2)} EUR</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Por m2</p><p className="mt-2 text-base text-slate-700">{rule.price_per_m2.toFixed(2)} EUR</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Diario almacen</p><p className="mt-2 text-base text-slate-700">{rule.storage_daily_price.toFixed(2)} EUR</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Limpieza</p><p className="mt-2 text-base text-slate-700">{rule.cleaning_price.toFixed(2)} EUR</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Entrega</p><p className="mt-2 text-base text-slate-700">{rule.delivery_price.toFixed(2)} EUR</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Extra fijo</p><p className="mt-2 text-base text-slate-700">{rule.extra_price.toFixed(2)} EUR</p></div>
      </div>
    </section>
  );
}
