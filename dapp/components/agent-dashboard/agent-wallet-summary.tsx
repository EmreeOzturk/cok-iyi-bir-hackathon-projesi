"use client";

import { CreditCardIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/stores/use-wallet-store";

export const AgentWalletSummary = () => {
  const { connectedAccount, dailyLimit, refreshBalances } = useWalletStore();

  return (
    <aside className="flex w-full flex-col gap-4 rounded-3xl border border-border/50 bg-white/70 p-6 text-sm shadow-sm backdrop-blur-md dark:bg-white/5 lg:w-[320px]">
      <div className="flex items-center gap-3 text-left">
        <div className="rounded-2xl bg-foreground/10 p-3 text-foreground">
          <CreditCardIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Agent Wallet
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {connectedAccount ?? "No wallet connected"}
          </p>
        </div>
      </div>
      <div className="space-y-2 text-left text-xs text-muted-foreground">
        <p>Daily spend limit: {dailyLimit.toLocaleString()} USDC</p>
        <p>
          Budget guard aktif. Limit üzerine çıkmaya çalışan PTB işlemleri önceden engellenecek.
        </p>
      </div>
      <Button variant="secondary" onClick={refreshBalances} className="justify-center">
        Refresh balances
      </Button>
    </aside>
  );
};

