import type { StorageLocation } from "@/features/locations/types/location";

type LocationDetailsCardProps = {
  location: StorageLocation;
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LocationDetailsCard({ location }: LocationDetailsCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Label
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            {location.label}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Zona
          </p>
          <p className="mt-2 text-base text-slate-700">{location.zone}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Estanteria
          </p>
          <p className="mt-2 text-base text-slate-700">{location.rack}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Nivel
          </p>
          <p className="mt-2 text-base text-slate-700">{location.level}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Posicion
          </p>
          <p className="mt-2 text-base text-slate-700">{location.position}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Estado
          </p>
          <p className="mt-2 text-base text-slate-700">
            {location.is_occupied ? "Ocupada" : "Libre"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Creada
          </p>
          <p className="mt-2 text-base text-slate-700">
            {formatDateTime(location.created_at)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ultima actualizacion
          </p>
          <p className="mt-2 text-base text-slate-700">
            {formatDateTime(location.updated_at)}
          </p>
        </div>
      </div>
    </section>
  );
}
