type ClientSearchProps = {
  defaultValue: string;
};

export function ClientSearch({ defaultValue }: ClientSearchProps) {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Buscar por nombre, telefono o email"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        />
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
