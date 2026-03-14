import { APP_NAME } from "@/lib/constants/app";

export function AppHeader() {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/85 px-5 py-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
          Superclim Servicios
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
          {APP_NAME}
        </h2>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
        Base tecnica preparada
      </div>
    </header>
  );
}
