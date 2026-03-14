"use client";

import { useActionState } from "react";

import {
  applyRugMovementAction,
  rugMovementInitialState,
} from "@/features/movements/actions/apply-rug-movement";
import type { RugMovementFormState } from "@/features/movements/types/movement";
import type { RugListItem } from "@/features/rugs/types/rug";

type RugMovementFormProps = {
  rug: RugListItem;
  availableLocations: Array<{
    id: string;
    label: string;
  }>;
};

function FormMessage({ state }: { state: RugMovementFormState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {state.message}
    </div>
  );
}

export function RugMovementForm({
  rug,
  availableLocations,
}: RugMovementFormProps) {
  const [state, formAction, pending] = useActionState(
    applyRugMovementAction,
    rugMovementInitialState,
  );

  const filteredLocations = availableLocations.filter(
    (location) => location.id !== rug.storage_location_id,
  );

  const canExit = rug.current_status !== "delivered" && rug.current_status !== "cancelled";
  const canAssignLocation = !rug.storage_location_id && canExit;
  const canTransfer = Boolean(rug.storage_location_id) && canExit;

  if (!canAssignLocation && !canTransfer && !canExit) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Operaciones</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Las operaciones actualizan historico, ubicacion, ocupacion y estado.
        </p>
      </div>

      <FormMessage state={state} />

      {canAssignLocation ? (
        <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input type="hidden" name="rugId" value={rug.id} />
          <input type="hidden" name="movementType" value="entry" />
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Registrar entrada en ubicacion</h3>
            <p className="mt-1 text-sm text-slate-600">
              Usa esta operacion para asignar una ubicacion a una alfombra que aun no esta almacenada.
            </p>
          </div>
          <select
            name="toLocationId"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
          >
            <option value="">Selecciona una ubicacion</option>
            {filteredLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </select>
          <textarea
            name="notes"
            rows={3}
            placeholder="Notas operativas"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-500"
          >
            {pending ? "Procesando..." : "Registrar entrada"}
          </button>
        </form>
      ) : null}

      {canTransfer ? (
        <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input type="hidden" name="rugId" value={rug.id} />
          <input type="hidden" name="movementType" value="relocation" />
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Transferir ubicacion</h3>
            <p className="mt-1 text-sm text-slate-600">
              Ubicacion actual: {rug.location?.label ?? "Sin asignar"}.
            </p>
          </div>
          <select
            name="toLocationId"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
          >
            <option value="">Selecciona una ubicacion de destino</option>
            {filteredLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </select>
          <textarea
            name="notes"
            rows={3}
            placeholder="Motivo o detalle del traslado"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {pending ? "Procesando..." : "Registrar transferencia"}
          </button>
        </form>
      ) : null}

      {canExit ? (
        <form action={formAction} className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <input type="hidden" name="rugId" value={rug.id} />
          <input type="hidden" name="movementType" value="exit" />
          <div>
            <h3 className="text-sm font-semibold text-rose-900">Registrar salida / entrega</h3>
            <p className="mt-1 text-sm text-rose-700">
              Libera la ubicacion actual y marca la alfombra como entregada.
            </p>
          </div>
          <textarea
            name="notes"
            rows={3}
            placeholder="Notas de salida o entrega"
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-rose-400"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-rose-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-rose-500"
          >
            {pending ? "Procesando..." : "Registrar salida"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
