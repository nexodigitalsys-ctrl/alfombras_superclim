import Link from "next/link";

import type { DashboardRugItem } from "@/features/dashboard/types/dashboard";

type RecentRugsListProps = {
  title: string;
  description: string;
  items: DashboardRugItem[];
  dateField: "entry_date" | "expected_exit_date" | "actual_exit_date";
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function RecentRugsList({
  title,
  description,
  items,
  dateField,
}: RecentRugsListProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          Sin registros para mostrar.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/rugs/${item.id}`}
              className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:bg-slate-100"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {item.code} · {item.type}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.client?.full_name ?? "Sin cliente"} ·{" "}
                    {item.location?.label ?? "Sin ubicacion"}
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  {formatDate(item[dateField])}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
