import Link from "next/link";

type ModuleCardProps = {
  module: {
    title: string;
    description: string;
    status: string;
    href: string;
  };
};

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
          {module.title}
        </h3>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {module.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {module.description}
      </p>
      <div className="mt-5">
        <Link
          href={module.href}
          className="text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
        >
          Abrir modulo
        </Link>
      </div>
    </article>
  );
}
