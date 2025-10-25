import { AgentWalletSummary } from "@/components/agent-dashboard/agent-wallet-summary";

export const DashboardHeader = () => {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          SuiPay Agent Nexus
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
          Autonomous Agent Command Center
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Mastra destekli ajanın finansal sağlığını, hizmet kullanımını ve zincir üstü itibarı canlı olarak yönetin.
        </p>
      </div>
      <AgentWalletSummary />
    </header>
  );
};

