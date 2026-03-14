"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  clientFormInitialState,
  upsertClientAction,
} from "@/features/clients/actions/upsert-client";
import type {
  Client,
  ClientFormState,
  ClientFormValues,
} from "@/features/clients/types/client";
import { cn } from "@/lib/utils/cn";

type ClientFormProps = {
  client?: Client;
};

function getDefaultValues(client?: Client): ClientFormValues {
  return {
    fullName: client?.full_name ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    address: client?.address ?? "",
    notes: client?.notes ?? "",
  };
}

type FieldProps = {
  label: string;
  name: keyof ClientFormValues;
  defaultValue: string;
  error?: string[];
  required?: boolean;
  multiline?: boolean;
};

function Field({
  label,
  name,
  defaultValue,
  error,
  required,
  multiline,
}: FieldProps) {
  const commonClassName = cn(
    "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
    error
      ? "border-rose-300 bg-rose-50 focus:border-rose-400"
      : "border-slate-200 bg-white focus:border-teal-500",
  );

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={5}
          className={commonClassName}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className={commonClassName}
        />
      )}
      {error ? (
        <p className="mt-2 text-sm text-rose-600">{error[0]}</p>
      ) : null}
    </label>
  );
}

function FormMessage({ state }: { state: ClientFormState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {state.message}
    </div>
  );
}

export function ClientForm({ client }: ClientFormProps) {
  const [rawState, formAction, pending] = useActionState(
    upsertClientAction,
    clientFormInitialState,
  );
  const state = rawState ?? clientFormInitialState;
  const fieldErrors = state.fieldErrors ?? {};
  const defaultValues = getDefaultValues(client);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={client?.id ?? ""} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Nombre completo"
          name="fullName"
          defaultValue={defaultValues.fullName}
          error={fieldErrors.fullName}
          required
        />
        <Field
          label="Telefono"
          name="phone"
          defaultValue={defaultValues.phone}
          error={fieldErrors.phone}
          required
        />
        <Field
          label="Email"
          name="email"
          defaultValue={defaultValues.email}
          error={fieldErrors.email}
        />
        <Field
          label="Direccion"
          name="address"
          defaultValue={defaultValues.address}
          error={fieldErrors.address}
        />
      </div>

      <Field
        label="Notas"
        name="notes"
        defaultValue={defaultValues.notes}
        error={fieldErrors.notes}
        multiline
      />

      <FormMessage state={state} />

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Los cambios se guardan directamente en la tabla `clients`.
        </p>
        <div className="flex gap-3">
          <Link
            href={client ? `/clients/${client.id}` : "/clients"}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-500"
          >
            {pending ? "Guardando..." : client ? "Guardar cambios" : "Crear cliente"}
          </button>
        </div>
      </div>
    </form>
  );
}
