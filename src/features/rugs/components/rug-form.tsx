"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import {
  rugFormInitialState,
  upsertRugAction,
} from "@/features/rugs/actions/upsert-rug";
import { calculateRugPricing } from "@/lib/pricing/calculate-rug-pricing";
import type {
  Rug,
  RugFormOptions,
  RugFormState,
  RugFormValues,
} from "@/features/rugs/types/rug";
import { rugStatuses, serviceTypes, sizeCategories } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

type RugFormProps = {
  rug?: Rug;
  options: RugFormOptions;
};

function getDefaultValues(rug?: Rug): RugFormValues {
  return {
    clientId: rug?.client_id ?? "",
    type: rug?.type ?? "",
    widthCm: rug ? String(rug.width_cm) : "",
    lengthCm: rug ? String(rug.length_cm) : "",
    sizeCategory: rug?.size_category ?? "medium",
    primaryColor: rug?.primary_color ?? "",
    conditionIn: rug?.condition_in ?? "",
    currentStatus: rug?.current_status ?? "received",
    storageLocationId: rug?.storage_location_id ?? "",
    entryDate: rug?.entry_date ?? "",
    expectedExitDate: rug?.expected_exit_date ?? "",
    actualExitDate: rug?.actual_exit_date ?? "",
    serviceType: rug?.service_type ?? "storage_only",
    includesCleaning: rug?.includes_cleaning ?? false,
    includesDelivery: rug?.includes_delivery ?? false,
    basePrice: rug ? String(rug.base_price) : "0",
    storagePrice: rug ? String(rug.storage_price) : "0",
    extraPrice: rug ? String(rug.extra_price) : "0",
    totalPrice: rug ? String(rug.total_price) : "0",
    notes: rug?.notes ?? "",
  };
}

function FormMessage({ state }: { state: RugFormState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {state.message}
    </div>
  );
}

type InputProps = {
  label: string;
  name: keyof RugFormValues;
  defaultValue: string;
  value?: string;
  error?: string[];
  type?: "text" | "number" | "date";
  required?: boolean;
  step?: string;
  readOnly?: boolean;
};

function InputField({
  label,
  name,
  defaultValue,
  value,
  error,
  type = "text",
  required,
  step,
  readOnly,
}: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        step={step}
        readOnly={readOnly}
        className={cn(
          "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-400"
            : "border-slate-200 bg-white focus:border-teal-500",
          readOnly ? "bg-slate-50" : "",
        )}
      />
      {error ? <p className="mt-2 text-sm text-rose-600">{error[0]}</p> : null}
    </label>
  );
}

type SelectProps = {
  label: string;
  name: keyof RugFormValues;
  defaultValue: string;
  options: ReadonlyArray<{
    value: string;
    label: string;
  }>;
  error?: string[];
  required?: boolean;
};

function SelectField({
  label,
  name,
  defaultValue,
  options,
  error,
  required,
}: SelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className={cn(
          "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-400"
            : "border-slate-200 bg-white focus:border-teal-500",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-sm text-rose-600">{error[0]}</p> : null}
    </label>
  );
}

export function RugForm({ rug, options }: RugFormProps) {
  const [rawState, formAction, pending] = useActionState(
    upsertRugAction,
    rugFormInitialState,
  );
  const state = rawState ?? rugFormInitialState;
  const fieldErrors = state.fieldErrors ?? {};
  const defaults = getDefaultValues(rug);
  const [pricing, setPricing] = useState(() => ({
    basePrice: Number(defaults.basePrice),
    storagePrice: Number(defaults.storagePrice),
    extraPrice: Number(defaults.extraPrice),
    totalPrice: Number(defaults.totalPrice),
    months: 1,
    areaM2: 0,
  }));

  useEffect(() => {
    const form = document.getElementById("rug-form");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const recalculate = () => {
      const formData = new FormData(form);
      const widthCm = Number(formData.get("widthCm") || 0);
      const lengthCm = Number(formData.get("lengthCm") || 0);
      const sizeCategory = String(formData.get("sizeCategory") || defaults.sizeCategory);
      const serviceType = String(formData.get("serviceType") || defaults.serviceType);
      const includesCleaning = formData.get("includesCleaning") === "true";
      const includesDelivery = formData.get("includesDelivery") === "true";
      const entryDate = String(formData.get("entryDate") || "");
      const expectedExitDate = String(formData.get("expectedExitDate") || "");
      const actualExitDate = String(formData.get("actualExitDate") || "");

      const rule =
        options.pricingRules.find(
          (item) =>
            item.service_type === serviceType &&
            item.size_category === sizeCategory &&
            item.is_active,
        ) ?? null;

      const calculated = calculateRugPricing({
        widthCm,
        lengthCm,
        sizeCategory: sizeCategory as RugFormValues["sizeCategory"],
        serviceType: serviceType as RugFormValues["serviceType"],
        includesCleaning,
        includesDelivery,
        entryDate,
        expectedExitDate: expectedExitDate || null,
        actualExitDate: actualExitDate || null,
        rule,
      });

      setPricing(calculated);
    };

    recalculate();
    form.addEventListener("input", recalculate);
    form.addEventListener("change", recalculate);

    return () => {
      form.removeEventListener("input", recalculate);
      form.removeEventListener("change", recalculate);
    };
  }, [defaults.serviceType, defaults.sizeCategory, options.pricingRules]);

  return (
    <form id="rug-form" action={formAction} className="space-y-8">
      <input type="hidden" name="id" value={rug?.id ?? ""} />

      <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
        {rug
          ? `Codigo actual: ${rug.code}`
          : "El codigo se genera automaticamente al guardar la alfombra."}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-950">Datos principales</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Cliente"
            name="clientId"
            defaultValue={defaults.clientId}
            error={fieldErrors.clientId}
            required
            options={[
              { value: "", label: "Selecciona un cliente" },
              ...options.clients.map((client) => ({
                value: client.id,
                label: client.full_name,
              })),
            ]}
          />
          <InputField
            label="Tipo"
            name="type"
            defaultValue={defaults.type}
            error={fieldErrors.type}
            required
          />
          <SelectField
            label="Categoria"
            name="sizeCategory"
            defaultValue={defaults.sizeCategory}
            error={fieldErrors.sizeCategory}
            required
            options={sizeCategories.map((value) => ({
              value,
              label: value,
            }))}
          />
          <InputField
            label="Ancho (cm)"
            name="widthCm"
            type="number"
            defaultValue={defaults.widthCm}
            error={fieldErrors.widthCm}
            required
          />
          <InputField
            label="Largo (cm)"
            name="lengthCm"
            type="number"
            defaultValue={defaults.lengthCm}
            error={fieldErrors.lengthCm}
            required
          />
          <InputField
            label="Color principal"
            name="primaryColor"
            defaultValue={defaults.primaryColor}
            error={fieldErrors.primaryColor}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-950">Operacion</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Estado"
            name="currentStatus"
            defaultValue={defaults.currentStatus}
            error={fieldErrors.currentStatus}
            required
            options={rugStatuses.map((value) => ({
              value,
              label: value,
            }))}
          />
          <SelectField
            label="Servicio"
            name="serviceType"
            defaultValue={defaults.serviceType}
            error={fieldErrors.serviceType}
            required
            options={serviceTypes.map((value) => ({
              value,
              label: value,
            }))}
          />
          <SelectField
            label="Ubicacion"
            name="storageLocationId"
            defaultValue={defaults.storageLocationId}
            error={fieldErrors.storageLocationId}
            options={[
              { value: "", label: "Sin asignar" },
              ...options.locations.map((location) => ({
                value: location.id,
                label: location.label,
              })),
            ]}
          />
          <InputField
            label="Entrada"
            name="entryDate"
            type="date"
            defaultValue={defaults.entryDate}
            error={fieldErrors.entryDate}
            required
          />
          <InputField
            label="Salida prevista"
            name="expectedExitDate"
            type="date"
            defaultValue={defaults.expectedExitDate}
            error={fieldErrors.expectedExitDate}
          />
          <InputField
            label="Salida real"
            name="actualExitDate"
            type="date"
            defaultValue={defaults.actualExitDate}
            error={fieldErrors.actualExitDate}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              name="includesCleaning"
              value="true"
              defaultChecked={defaults.includesCleaning}
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            <span className="text-sm text-slate-700">Incluye limpieza</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              name="includesDelivery"
              value="true"
              defaultChecked={defaults.includesDelivery}
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            <span className="text-sm text-slate-700">Incluye entrega</span>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-950">Precio y notas</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <InputField
            label="Precio base"
            name="basePrice"
            type="number"
            step="0.01"
            defaultValue={defaults.basePrice}
            value={pricing.basePrice.toFixed(2)}
            error={fieldErrors.basePrice}
            required
            readOnly
          />
          <InputField
            label="Precio almacenamiento"
            name="storagePrice"
            type="number"
            step="0.01"
            defaultValue={defaults.storagePrice}
            value={pricing.storagePrice.toFixed(2)}
            error={fieldErrors.storagePrice}
            required
            readOnly
          />
          <InputField
            label="Precio extra"
            name="extraPrice"
            type="number"
            step="0.01"
            defaultValue={defaults.extraPrice}
            value={pricing.extraPrice.toFixed(2)}
            error={fieldErrors.extraPrice}
            required
            readOnly
          />
          <InputField
            label="Precio total"
            name="totalPrice"
            type="number"
            step="0.01"
            defaultValue={defaults.totalPrice}
            value={pricing.totalPrice.toFixed(2)}
            error={fieldErrors.totalPrice}
            required
            readOnly
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Calculo actual: {pricing.areaM2.toFixed(2)} m2, {pricing.months} mes(es), total {pricing.totalPrice.toFixed(2)} EUR.
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Estado de entrada</span>
          <textarea
            name="conditionIn"
            defaultValue={defaults.conditionIn}
            rows={4}
            className={cn(
              "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
              fieldErrors.conditionIn
                ? "border-rose-300 bg-rose-50 focus:border-rose-400"
                : "border-slate-200 bg-white focus:border-teal-500",
            )}
          />
          {fieldErrors.conditionIn ? (
            <p className="mt-2 text-sm text-rose-600">
              {fieldErrors.conditionIn[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Observaciones</span>
          <textarea
            name="notes"
            defaultValue={defaults.notes}
            rows={5}
            className={cn(
              "mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-950 outline-none transition-colors",
              fieldErrors.notes
                ? "border-rose-300 bg-rose-50 focus:border-rose-400"
                : "border-slate-200 bg-white focus:border-teal-500",
            )}
          />
          {fieldErrors.notes ? (
            <p className="mt-2 text-sm text-rose-600">
              {fieldErrors.notes[0]}
            </p>
          ) : null}
        </label>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Preparado para fotos: el modelo ya soporta `photos`, pero el upload completo queda para la siguiente etapa.
        </div>
      </section>

      <FormMessage state={state} />

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          El codigo se genera solo al crear y las localizaciones ocupadas no se ofrecen en el alta.
        </p>
        <div className="flex gap-3">
          <Link
            href={rug ? `/rugs/${rug.id}` : "/rugs"}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-500"
          >
            {pending ? "Guardando..." : rug ? "Guardar cambios" : "Crear alfombra"}
          </button>
        </div>
      </div>
    </form>
  );
}
