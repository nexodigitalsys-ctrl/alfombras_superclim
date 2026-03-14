type WarehouseOccupancyCardProps = {
  occupiedLocations: number;
  totalLocations: number;
  occupancyRate: number;
};

export function WarehouseOccupancyCard({
  occupiedLocations,
  totalLocations,
  occupancyRate,
}: WarehouseOccupancyCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Ocupacion del almacen</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Uso actual de posiciones fisicas registradas.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tracking-tight text-slate-950">
            {occupancyRate}%
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {occupiedLocations} / {totalLocations}
          </p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-700"
          style={{ width: `${Math.min(occupancyRate, 100)}%` }}
        />
      </div>
    </section>
  );
}
