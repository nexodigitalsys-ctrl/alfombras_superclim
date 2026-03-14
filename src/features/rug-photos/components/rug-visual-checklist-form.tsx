"use client";

import { useActionState } from "react";

import { updateRugVisualChecklistAction } from "@/features/rug-photos/actions/update-rug-visual-checklist";
import type { RugVisualChecklistState } from "@/features/rug-photos/types/rug-photo";
import type { RugListItem } from "@/features/rugs/types/rug";
import { cn } from "@/lib/utils/cn";

type RugVisualChecklistFormProps = {
  rug: RugListItem;
};

const rugVisualChecklistInitialState: RugVisualChecklistState = {
  status: "idle",
  message: null,
};

type ChecklistItemProps = {
  name: string;
  label: string;
  defaultChecked: boolean;
};

function ChecklistItem({ name, label, defaultChecked }: ChecklistItemProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <input type="hidden" name={name} value="false" />
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

export function RugVisualChecklistForm({ rug }: RugVisualChecklistFormProps) {
  const [state, formAction, pending] = useActionState(
    updateRugVisualChecklistAction,
    rugVisualChecklistInitialState,
  );

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Checklist visual</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Marca rapidamente los hitos visuales y operativos de esta alfombra.
        </p>
      </div>

      {state.message ? (
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            state.status === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="rugId" value={rug.id} />

        <div className="grid gap-3 lg:grid-cols-2">
          <ChecklistItem
            name="photographedOnEntry"
            label="Fotografada na entrada"
            defaultChecked={rug.photographed_on_entry}
          />
          <ChecklistItem
            name="conditionReviewed"
            label="Estado revisado"
            defaultChecked={rug.condition_reviewed}
          />
          <ChecklistItem
            name="cleaningCompleted"
            label="Limpeza concluida"
            defaultChecked={rug.cleaning_completed}
          />
          <ChecklistItem
            name="storedCorrectly"
            label="Armazenada corretamente"
            defaultChecked={rug.stored_correctly}
          />
          <ChecklistItem
            name="readyForExit"
            label="Pronta para saida"
            defaultChecked={rug.ready_for_exit}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {pending ? "Guardando..." : "Guardar checklist"}
        </button>
      </form>
    </section>
  );
}
