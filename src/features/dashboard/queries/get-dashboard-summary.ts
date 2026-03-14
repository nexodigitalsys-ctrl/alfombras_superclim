import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rugStatuses } from "@/types/domain";

import type {
  DashboardRugItem,
  DashboardSummary,
  StatusDistributionItem,
} from "@/features/dashboard/types/dashboard";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const supabase = await createSupabaseServerClient();

    const [
      { count: storedCount },
      { count: totalLocations },
      { count: occupiedLocations },
      { data: recentEntries },
      { data: recentExits },
      { data: upcomingPickups },
      { data: activeRugs },
      { data: allRugs },
    ] = await Promise.all([
      supabase
        .from("rugs")
        .select("*", { count: "exact", head: true })
        .eq("current_status", "stored"),
      supabase.from("storage_locations").select("*", { count: "exact", head: true }),
      supabase
        .from("storage_locations")
        .select("*", { count: "exact", head: true })
        .eq("is_occupied", true),
      supabase
        .from("rugs")
        .select(
          `
            id,
            code,
            type,
            entry_date,
            expected_exit_date,
            actual_exit_date,
            total_price,
            current_status,
            client:clients(id, full_name),
            location:storage_locations(id, label)
          `,
        )
        .order("entry_date", { ascending: false })
        .limit(5),
      supabase
        .from("rugs")
        .select(
          `
            id,
            code,
            type,
            entry_date,
            expected_exit_date,
            actual_exit_date,
            total_price,
            current_status,
            client:clients(id, full_name),
            location:storage_locations(id, label)
          `,
        )
        .not("actual_exit_date", "is", null)
        .order("actual_exit_date", { ascending: false })
        .limit(5),
      supabase
        .from("rugs")
        .select(
          `
            id,
            code,
            type,
            entry_date,
            expected_exit_date,
            actual_exit_date,
            total_price,
            current_status,
            client:clients(id, full_name),
            location:storage_locations(id, label)
          `,
        )
        .in("current_status", ["stored", "pending_exit"])
        .not("expected_exit_date", "is", null)
        .order("expected_exit_date", { ascending: true })
        .limit(5),
      supabase
        .from("rugs")
        .select("total_price")
        .not("current_status", "in", "(delivered,cancelled)"),
      supabase.from("rugs").select("current_status"),
    ]);

    const pendingPaymentsAmount = roundMoney(
      (activeRugs ?? []).reduce((sum, rug) => sum + Number(rug.total_price ?? 0), 0),
    );

    const distributionMap = new Map<string, number>();
    rugStatuses.forEach((status) => {
      distributionMap.set(status, 0);
    });

    (allRugs ?? []).forEach((rug) => {
      distributionMap.set(
        rug.current_status,
        (distributionMap.get(rug.current_status) ?? 0) + 1,
      );
    });

    const statusDistribution: StatusDistributionItem[] = rugStatuses.map((status) => ({
      status,
      count: distributionMap.get(status) ?? 0,
    }));

    const locationBase = totalLocations ?? 0;
    const occupiedBase = occupiedLocations ?? 0;

    return {
      storedCount: storedCount ?? 0,
      occupancyRate: locationBase === 0 ? 0 : Math.round((occupiedBase / locationBase) * 100),
      occupiedLocations: occupiedBase,
      totalLocations: locationBase,
      pendingPaymentsAmount,
      upcomingPickupsCount: (upcomingPickups ?? []).length,
      recentEntries: (recentEntries ?? []) as unknown as DashboardRugItem[],
      recentExits: (recentExits ?? []) as unknown as DashboardRugItem[],
      upcomingPickups: (upcomingPickups ?? []) as unknown as DashboardRugItem[],
      statusDistribution,
    };
  } catch {
    return {
      storedCount: 0,
      occupancyRate: 0,
      occupiedLocations: 0,
      totalLocations: 0,
      pendingPaymentsAmount: 0,
      upcomingPickupsCount: 0,
      recentEntries: [],
      recentExits: [],
      upcomingPickups: [],
      statusDistribution: rugStatuses.map((status) => ({
        status,
        count: 0,
      })),
    };
  }
}
