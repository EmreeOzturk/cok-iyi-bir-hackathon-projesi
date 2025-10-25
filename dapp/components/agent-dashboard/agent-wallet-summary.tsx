/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { WalletConnection } from "@/components/wallet-connection";
import { useWalletStore } from "@/stores/use-wallet-store";
import { formatAddress } from "@/lib/sui";

export const AgentWalletSummary = () => {
  const {
    connectedAccount,
    balances,
    refreshBalances
  } = useWalletStore();

  useEffect(() => {
    if (connectedAccount) {
      refreshBalances();
    }
  }, [connectedAccount]);

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
            {connectedAccount ? formatAddress(connectedAccount) : "No wallet connected"}
          </p>
        </div>
      </div>

      {connectedAccount && (
        <div className="space-y-2 text-left text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>SUI Balance:</span>
            <span className="font-medium">{balances.SUI?.toFixed(4) || "0.0000"} SUI</span>
          </div>
          <div className="flex justify-between">
            <span>USDC Balance:</span>
            <span className="font-medium">{balances.USDC?.toFixed(2) || "0.00"} USDC</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!connectedAccount ? (
          <div className="flex-1">
            <WalletConnection />
          </div>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={refreshBalances}
              className="flex-1 justify-center"
            >
              Refresh
            </Button>
            <div className="flex-1">
              <WalletConnection />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

