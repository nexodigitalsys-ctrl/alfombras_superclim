import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { RecentRugsList } from "@/features/dashboard/components/recent-rugs-list";
import { StatusDistributionCard } from "@/features/dashboard/components/status-distribution-card";
import { WarehouseOccupancyCard } from "@/features/dashboard/components/warehouse-occupancy-card";
import { getDashboardSummary } from "@/features/dashboard/queries/get-dashboard-summary";
import { ModuleCard } from "@/components/ui/module-card";
import { APP_MODULES, APP_NAME } from "@/lib/constants/app";

function formatMoney(value: number): string {
  return `${value.toFixed(2)} EUR`;
}

export default async function Home() {
  const summary = await getDashboardSummary();

  return (
    <AppShell>
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Base del sistema
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {APP_NAME}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Fundacion inicial del panel administrativo para gestionar entrada,
              almacenamiento, seguimiento y salida de alfombras.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Alfombras almacenadas"
            value={String(summary.storedCount)}
            helper="Piezas actualmente ubicadas y en estado almacenado."
          />
          <KpiCard
            label="Proximas retiradas"
            value={String(summary.upcomingPickupsCount)}
            helper="Alfombras con salida prevista cercana y seguimiento necesario."
          />
          <KpiCard
            label="Cobro pendiente"
            value={formatMoney(summary.pendingPaymentsAmount)}
            helper="Importe pendiente estimado de alfombras no cerradas."
          />
          <KpiCard
            label="Ocupacion"
            value={`${summary.occupancyRate}%`}
            helper={`${summary.occupiedLocations} ubicaciones ocupadas de ${summary.totalLocations}.`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <WarehouseOccupancyCard
            occupiedLocations={summary.occupiedLocations}
            totalLocations={summary.totalLocations}
            occupancyRate={summary.occupancyRate}
          />
          <StatusDistributionCard items={summary.statusDistribution} />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <RecentRugsList
            title="Entradas recientes"
            description="Ultimas alfombras registradas en el sistema."
            items={summary.recentEntries}
            dateField="entry_date"
          />
          <RecentRugsList
            title="Salidas recientes"
            description="Ultimas entregas o cierres registrados."
            items={summary.recentExits}
            dateField="actual_exit_date"
          />
          <RecentRugsList
            title="Proximas retiradas"
            description="Alfombras con salida prevista mas cercana."
            items={summary.upcomingPickups}
            dateField="expected_exit_date"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {APP_MODULES.map((module) => (
            <ModuleCard key={module.title} module={module} />
          ))}
        </section>
      </section>
    </AppShell>
  );
}
