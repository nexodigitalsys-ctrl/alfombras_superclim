type LocationFiltersProps = {
  defaultSearchTerm: string;
  defaultZone: string;
  defaultOccupancy: "all" | "occupied" | "free";
};

export function LocationFilters({
  defaultSearchTerm,
  defaultZone,
  defaultOccupancy,
}: LocationFiltersProps) {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={defaultSearchTerm}
          placeholder="Buscar por label, zona, rack o posicion"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        />
        <input
          name="zone"
          defaultValue={defaultZone}
          placeholder="Zona"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        />
        <select
          name="occupancy"
          defaultValue={defaultOccupancy}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        >
          <option value="all">Todas</option>
          <option value="free">Libres</option>
          <option value="occupied">Ocupadas</option>
        </select>
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
}
