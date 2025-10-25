"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useWalletStore } from "@/stores/use-wallet-store";

export const TransactionComposer = () => {
  const { connectedAccount } = useWalletStore();
  const [serviceId, setServiceId] = useState("");
  const [amount, setAmount] = useState("0.00");

  const handleCompose = () => {
    if (!connectedAccount) {
      // TODO: surface toast using UI hook
      return;
    }
    // TODO: integrate with Sui transaction builder + Mastra orchestrator
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Programmable Transaction</CardTitle>
        <CardDescription>
          AccessNFT mint + ödeme akışını tek adımda simüle edin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Service ID
          </label>
          <input
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            placeholder="0x..."
            className="rounded-full border border-border/50 bg-background px-4 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Amount (USDC)
          </label>
          <input
            value={amount}
            type="number"
            min="0"
            onChange={(event) => setAmount(event.target.value)}
            className="rounded-full border border-border/50 bg-background px-4 py-2 text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleCompose}>Compose PTB</Button>
      </CardFooter>
    </Card>
  );
};

