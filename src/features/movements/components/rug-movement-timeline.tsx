import type { RugMovement } from "@/features/movements/types/movement";

type RugMovementTimelineProps = {
  movements: RugMovement[];
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getMovementTitle(movement: RugMovement): string {
  if (movement.movement_type === "entry") {
    return "Entrada";
  }

  if (movement.movement_type === "relocation") {
    return "Transferencia";
  }

  return "Salida";
}

export function RugMovementTimeline({
  movements,
}: RugMovementTimelineProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Historial operativo</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Timeline cronologica para auditoria de entradas, traslados y salidas.
          </p>
        </div>
      </div>

      {movements.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          Aun no hay movimientos registrados.
        </div>
      ) : (
        <ol className="mt-6 space-y-4">
          {movements.map((movement) => (
            <li
              key={movement.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {getMovementTitle(movement)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {movement.from_location?.label ?? "Sin origen"} {" -> "}{" "}
                    {movement.to_location?.label ?? "Sin destino"}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  {formatDateTime(movement.moved_at)}
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {movement.notes || "Sin notas"}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
