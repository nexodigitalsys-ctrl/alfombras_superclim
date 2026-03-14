import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <AppHeader />
          <main className="flex-1 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
