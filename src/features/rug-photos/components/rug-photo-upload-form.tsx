"use client";

import { useActionState } from "react";

import {
  rugPhotoUploadInitialState,
  uploadRugPhotoAction,
} from "@/features/rug-photos/actions/upload-rug-photo";
import { rugPhotoCategoryLabels } from "@/features/rug-photos/types/rug-photo";
import { rugPhotoCategories } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

type RugPhotoUploadFormProps = {
  rugId: string;
};

export function RugPhotoUploadForm({ rugId }: RugPhotoUploadFormProps) {
  const [rawState, formAction, pending] = useActionState(
    uploadRugPhotoAction,
    rugPhotoUploadInitialState,
  );
  const state = rawState ?? rugPhotoUploadInitialState;

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Fotos operativas</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Sube fotos por etapa para documentar el estado real de la alfombra.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="rugId" value={rugId} />

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Categoria</span>
            <select
              name="category"
              defaultValue="entry"
              className={cn(
                "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
                state.fieldErrors.category
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400"
                  : "border-slate-200 bg-white focus:border-teal-500",
              )}
            >
              {rugPhotoCategories.map((category) => (
                <option key={category} value={category}>
                  {rugPhotoCategoryLabels[category]}
                </option>
              ))}
            </select>
            {state.fieldErrors.category ? (
              <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.category[0]}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Observacion corta</span>
            <input
              name="caption"
              maxLength={160}
              placeholder="Ej.: Mancha lateral antes de limpieza"
              className={cn(
                "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
                state.fieldErrors.caption
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400"
                  : "border-slate-200 bg-white focus:border-teal-500",
              )}
            />
            {state.fieldErrors.caption ? (
              <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.caption[0]}</p>
            ) : null}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Imagen</span>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            className={cn(
              "mt-2 block w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium",
              state.fieldErrors.photo
                ? "border-rose-300 bg-rose-50 focus:border-rose-400"
                : "border-slate-200 bg-white focus:border-teal-500",
            )}
          />
          <p className="mt-2 text-xs text-slate-500">JPG, PNG o WEBP. Maximo 5 MB.</p>
          {state.fieldErrors.photo ? (
            <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.photo[0]}</p>
          ) : null}
        </label>

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

        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-500"
        >
          {pending ? "Subiendo..." : "Subir foto"}
        </button>
      </form>
    </section>
  );
}
