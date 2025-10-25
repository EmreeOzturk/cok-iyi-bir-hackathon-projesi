import { Suspense } from "react";

import { AgentDashboardShell } from "@/components/agent-dashboard/agent-dashboard-shell";
import { AgentDashboardSkeleton } from "@/components/agent-dashboard/agent-dashboard-skeleton";

export default function AgentDashboardPage() {
  return (
    <Suspense fallback={<AgentDashboardSkeleton />}>
      <AgentDashboardShell />
    </Suspense>
  );
}

