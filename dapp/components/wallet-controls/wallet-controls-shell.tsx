import { WalletHeader } from "@/components/wallet-controls/wallet-header";
import { SpendGuardCard } from "@/components/wallet-controls/spend-guard-card";
import { TransactionComposer } from "@/components/wallet-controls/transaction-composer";
import { ActivityFeed } from "@/components/wallet-controls/activity-feed";

export const WalletControlsShell = () => (
  <div className="flex min-h-screen flex-col gap-8 bg-background px-8 py-10">
    <WalletHeader />
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
      <SpendGuardCard />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TransactionComposer />
        <ActivityFeed />
      </div>
    </div>
  </div>
);

