"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  buildLocationLabel,
  locationSchema,
} from "@/features/locations/schemas/location-schema";
import {
  locationFormInitialState,
  upsertLocationAction,
} from "@/features/locations/actions/upsert-location";
import type {
  LocationFormState,
  LocationFormValues,
  StorageLocation,
} from "@/features/locations/types/location";
import { cn } from "@/lib/utils/cn";

type LocationFormProps = {
  location?: StorageLocation;
};

function getDefaultValues(location?: StorageLocation): LocationFormValues {
  return {
    zone: location?.zone ?? "",
    rack: location?.rack ?? "",
    level: location?.level ?? "",
    position: location?.position ?? "",
    isOccupied: location?.is_occupied ?? false,
  };
}

type FieldProps = {
  label: string;
  name: keyof Omit<LocationFormValues, "isOccupied">;
  defaultValue: string;
  error?: string[];
};

function Field({ label, name, defaultValue, error }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label} *</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className={cn(
          "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-400"
            : "border-slate-200 bg-white focus:border-teal-500",
        )}
      />
      {error ? <p className="mt-2 text-sm text-rose-600">{error[0]}</p> : null}
    </label>
  );
}

function FormMessage({ state }: { state: LocationFormState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {state.message}
    </div>
  );
}

export function LocationForm({ location }: LocationFormProps) {
  const [rawState, formAction, pending] = useActionState(
    upsertLocationAction,
    locationFormInitialState,
  );
  const state = rawState ?? locationFormInitialState;
  const fieldErrors = state.fieldErrors ?? {};
  const defaultValues = getDefaultValues(location);

  const parsedDefaults = locationSchema.safeParse(defaultValues);
  const previewLabel = parsedDefaults.success
    ? buildLocationLabel(
        parsedDefaults.data.zone,
        parsedDefaults.data.rack,
        parsedDefaults.data.level,
        parsedDefaults.data.position,
      )
    : "A-00-00-00";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={location?.id ?? ""} />

      <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
        Etiqueta generada automaticamente: <strong>{location?.label ?? previewLabel}</strong>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Field
          label="Zona"
          name="zone"
          defaultValue={defaultValues.zone}
          error={fieldErrors.zone}
        />
        <Field
          label="Estanteria"
          name="rack"
          defaultValue={defaultValues.rack}
          error={fieldErrors.rack}
        />
        <Field
          label="Nivel"
          name="level"
          defaultValue={defaultValues.level}
          error={fieldErrors.level}
        />
        <Field
          label="Posicion"
          name="position"
          defaultValue={defaultValues.position}
          error={fieldErrors.position}
        />
      </div>

      <input
        type="hidden"
        name="isOccupied"
        value={defaultValues.isOccupied ? "true" : "false"}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        El estado de ocupacion se gestiona automaticamente desde los movimientos de alfombras.
      </div>

      <FormMessage state={state} />

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          La unicidad logica se valida por zona, estanteria, nivel y posicion.
        </p>
        <div className="flex gap-3">
          <Link
            href={location ? `/locations/${location.id}` : "/locations"}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-500"
          >
            {pending
              ? "Guardando..."
              : location
                ? "Guardar cambios"
                : "Crear ubicacion"}
          </button>
        </div>
      </div>
    </form>
  );
}
