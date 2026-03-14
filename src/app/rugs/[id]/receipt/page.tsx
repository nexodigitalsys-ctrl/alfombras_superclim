import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintReceiptButton } from "@/features/receipts/components/print-receipt-button";
import { RugReceiptDocument } from "@/features/receipts/components/rug-receipt-document";
import { getRugById } from "@/features/rugs/queries/get-rug-by-id";

type RugReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RugReceiptPage({ params }: RugReceiptPageProps) {
  const { id } = await params;
  const { data: rug } = await getRugById(id);

  if (!rug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4f4_0%,#f3f5f7_30%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="print-hide mx-auto mb-6 flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-950">
            Recibo imprimible
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Vista limpia para impresion o exportacion como PDF.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/rugs/${rug.id}`}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Volver
          </Link>
          <PrintReceiptButton />
        </div>
      </div>

      <RugReceiptDocument rug={rug} />
    </div>
  );
}
