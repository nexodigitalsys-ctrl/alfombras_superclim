"use client";

import Link from "next/link";
import { useActionState } from "react";

import { upsertPricingRuleAction } from "@/features/pricing/actions/upsert-pricing-rule";
import type {
  PricingRule,
  PricingRuleFormState,
  PricingRuleFormValues,
} from "@/features/pricing/types/pricing-rule";
import { serviceTypes, sizeCategories } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

type PricingRuleFormProps = {
  rule?: PricingRule;
};

const pricingRuleFormInitialState: PricingRuleFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

function getDefaultValues(rule?: PricingRule): PricingRuleFormValues {
  return {
    serviceType: rule?.service_type ?? "storage_only",
    sizeCategory: rule?.size_category ?? "medium",
    basePrice: rule ? String(rule.base_price) : "0",
    pricePerM2: rule ? String(rule.price_per_m2) : "0",
    storageDailyPrice: rule ? String(rule.storage_daily_price) : "0",
    cleaningPrice: rule ? String(rule.cleaning_price) : "0",
    deliveryPrice: rule ? String(rule.delivery_price) : "0",
    extraPrice: rule ? String(rule.extra_price) : "0",
    isActive: rule?.is_active ?? true,
  };
}

function FormMessage({ state }: { state: PricingRuleFormState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {state.message}
    </div>
  );
}

type NumericFieldProps = {
  label: string;
  name: keyof Omit<PricingRuleFormValues, "serviceType" | "sizeCategory" | "isActive">;
  defaultValue: string;
  error?: string[];
};

function NumericField({ label, name, defaultValue, error }: NumericFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        step="0.01"
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

export function PricingRuleForm({ rule }: PricingRuleFormProps) {
  const [rawState, formAction, pending] = useActionState(
    upsertPricingRuleAction,
    pricingRuleFormInitialState,
  );
  const state = rawState ?? pricingRuleFormInitialState;
  const fieldErrors = state.fieldErrors ?? {};
  const defaults = getDefaultValues(rule);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={rule?.id ?? ""} />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Servicio</span>
          <select
            name="serviceType"
            defaultValue={defaults.serviceType}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
          >
            {serviceTypes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tamano</span>
          <select
            name="sizeCategory"
            defaultValue={defaults.sizeCategory}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
          >
            {sizeCategories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <NumericField label="Base" name="basePrice" defaultValue={defaults.basePrice} error={fieldErrors.basePrice} />
        <NumericField label="Por m2" name="pricePerM2" defaultValue={defaults.pricePerM2} error={fieldErrors.pricePerM2} />
        <NumericField label="Diario almacen" name="storageDailyPrice" defaultValue={defaults.storageDailyPrice} error={fieldErrors.storageDailyPrice} />
        <NumericField label="Extra fijo" name="extraPrice" defaultValue={defaults.extraPrice} error={fieldErrors.extraPrice} />
        <NumericField label="Limpieza" name="cleaningPrice" defaultValue={defaults.cleaningPrice} error={fieldErrors.cleaningPrice} />
        <NumericField label="Entrega" name="deliveryPrice" defaultValue={defaults.deliveryPrice} error={fieldErrors.deliveryPrice} />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          name="isActive"
          value="true"
          defaultChecked={defaults.isActive}
          className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
        />
        <span className="text-sm text-slate-700">Regla activa</span>
      </label>

      <FormMessage state={state} />

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          El motor usa estas reglas para separar base, almacenamiento, extras y total.
        </p>
        <div className="flex gap-3">
          <Link
            href={rule ? `/pricing/${rule.id}` : "/pricing"}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-500"
          >
            {pending ? "Guardando..." : rule ? "Guardar cambios" : "Crear regla"}
          </button>
        </div>
      </div>
    </form>
  );
}
