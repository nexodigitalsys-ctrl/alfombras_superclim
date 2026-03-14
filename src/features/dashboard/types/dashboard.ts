import type { RugStatus } from "@/types/domain";

export type DashboardRugItem = {
  id: string;
  code: string;
  type: string;
  entry_date: string;
  expected_exit_date: string | null;
  actual_exit_date: string | null;
  total_price: number;
  current_status: RugStatus;
  client: {
    id: string;
    full_name: string;
  } | null;
  location: {
    id: string;
    label: string;
  } | null;
};

export type StatusDistributionItem = {
  status: RugStatus;
  count: number;
};

export type DashboardSummary = {
  storedCount: number;
  occupancyRate: number;
  occupiedLocations: number;
  totalLocations: number;
  pendingPaymentsAmount: number;
  upcomingPickupsCount: number;
  recentEntries: DashboardRugItem[];
  recentExits: DashboardRugItem[];
  upcomingPickups: DashboardRugItem[];
  statusDistribution: StatusDistributionItem[];
};
