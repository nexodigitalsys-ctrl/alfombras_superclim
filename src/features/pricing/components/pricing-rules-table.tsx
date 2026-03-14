import Link from "next/link";

import type { PricingRule } from "@/features/pricing/types/pricing-rule";
import { cn } from "@/lib/utils/cn";

type PricingRulesTableProps = {
  rules: PricingRule[];
};

export function PricingRulesTable({ rules }: PricingRulesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Servicio</th>
              <th className="px-5 py-4">Tamano</th>
              <th className="px-5 py-4">Base</th>
              <th className="px-5 py-4">Por m2</th>
              <th className="px-5 py-4">Diario</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="text-sm text-slate-700">
                <td className="px-5 py-4">{rule.service_type}</td>
                <td className="px-5 py-4">{rule.size_category}</td>
                <td className="px-5 py-4">{rule.base_price.toFixed(2)} EUR</td>
                <td className="px-5 py-4">{rule.price_per_m2.toFixed(2)} EUR</td>
                <td className="px-5 py-4">{rule.storage_daily_price.toFixed(2)} EUR</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", rule.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700")}>
                    {rule.is_active ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link href={`/pricing/${rule.id}`} className="text-sm font-medium text-teal-700 hover:text-teal-800">
                      Ver
                    </Link>
                    <Link href={`/pricing/${rule.id}/edit`} className="text-sm font-medium text-slate-700 hover:text-slate-950">
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
