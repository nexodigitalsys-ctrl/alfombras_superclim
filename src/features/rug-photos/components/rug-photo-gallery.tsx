import { deleteRugPhotoAction } from "@/features/rug-photos/actions/delete-rug-photo";
import { rugPhotoCategoryLabels, type RugPhotoItem } from "@/features/rug-photos/types/rug-photo";

type RugPhotoGalleryProps = {
  rugId: string;
  photos: RugPhotoItem[];
  error: string | null;
};

export function RugPhotoGallery({ rugId, photos, error }: RugPhotoGalleryProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Galeria visual</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Evidencia visual por etapa para operacion, control y futuro recibo.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          Aun no hay fotos cargadas para esta alfombra.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <img
                src={photo.publicUrl}
                alt={photo.caption || rugPhotoCategoryLabels[photo.category]}
                className="h-52 w-full bg-slate-100 object-cover"
              />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {rugPhotoCategoryLabels[photo.category]}
                  </span>
                  <form action={deleteRugPhotoAction}>
                    <input type="hidden" name="rugId" value={rugId} />
                    <input type="hidden" name="photoId" value={photo.id} />
                    <button
                      type="submit"
                      className="text-sm font-medium text-rose-700 transition-colors hover:text-rose-800"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  {photo.caption || "Sin observacion."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
