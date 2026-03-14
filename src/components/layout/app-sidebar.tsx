"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_ITEMS } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200/80 bg-slate-950 px-5 py-6 text-slate-50 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.7)] lg:block">
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
          Panel administrativo
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Estructura base preparada para modulos operativos internos.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {APP_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
            className={cn(
                "block rounded-2xl px-4 py-3 text-sm transition-colors",
                isActive
                ? "bg-teal-500/15 font-medium text-teal-100"
                : "text-slate-300",
            )}
          >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
