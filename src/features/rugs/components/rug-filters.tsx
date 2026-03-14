import { rugStatuses } from "@/types/domain";

type RugFiltersProps = {
  defaultSearchTerm: string;
  defaultStatus: string;
  defaultClientId: string;
  clients: Array<{
    id: string;
    full_name: string;
  }>;
};

export function RugFilters({
  defaultSearchTerm,
  defaultStatus,
  defaultClientId,
  clients,
}: RugFiltersProps) {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_260px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={defaultSearchTerm}
          placeholder="Buscar por codigo, tipo o color"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        />
        <select
          name="status"
          defaultValue={defaultStatus}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        >
          <option value="">Todos los estados</option>
          {rugStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          name="clientId"
          defaultValue={defaultClientId}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-teal-500"
        >
          <option value="">Todos los clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.full_name}
            </option>
          ))}
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
