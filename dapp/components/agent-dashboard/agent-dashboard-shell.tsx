import { Suspense } from "react";

import { AgentPerformanceCard } from "@/components/agent-dashboard/agent-performance-card";
import { RevenueOverviewCard } from "@/components/agent-dashboard/revenue-overview-card";
import { ServiceUsageList } from "@/components/agent-dashboard/service-usage-list";
import { ReputationSummaryCard } from "@/components/agent-dashboard/reputation-summary-card";

import { DashboardHeader } from "./dashboard-header";
import { DashboardGrid } from "./dashboard-grid";

export const AgentDashboardShell = () => {
  return (
    <div className="flex min-h-screen flex-col gap-10 bg-gradient-to-br from-background via-background/80 to-background px-8 py-10">
      <DashboardHeader />
      <DashboardGrid>
        <AgentPerformanceCard />
        <RevenueOverviewCard />
        <Suspense fallback={null}>
          <ServiceUsageList />
        </Suspense>
        <ReputationSummaryCard />
      </DashboardGrid>
    </div>
  );
};

