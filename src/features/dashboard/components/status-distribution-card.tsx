import type { StatusDistributionItem } from "@/features/dashboard/types/dashboard";

type StatusDistributionCardProps = {
  items: StatusDistributionItem[];
};

export function StatusDistributionCard({
  items,
}: StatusDistributionCardProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Distribucion por estado</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        Vista rapida del estado operativo actual de las alfombras.
      </p>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100);

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
                <span>{item.status}</span>
                <span>
                  {item.count} ({percentage}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
