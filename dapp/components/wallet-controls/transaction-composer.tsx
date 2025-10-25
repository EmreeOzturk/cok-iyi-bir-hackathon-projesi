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
import { useContractStore } from "@/stores/use-contract-store";

export const TransactionComposer = () => {
  const { connectedAccount, balances } = useWalletStore();
  const { purchaseService } = useContractStore();
  const [serviceId, setServiceId] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [credits, setCredits] = useState("5");
  const [isComposing, setIsComposing] = useState(false);

  const handleCompose = async () => {
    if (!connectedAccount) {
      alert("Please connect your wallet first");
      return;
    }

    if (!serviceId.trim()) {
      alert("Please enter a service ID");
      return;
    }

    const amountNum = parseFloat(amount);
    const creditsNum = parseInt(credits);

    if (amountNum <= 0 || creditsNum <= 0) {
      alert("Please enter valid amount and credits");
      return;
    }

    // Check balance
    if (balances.USDC < amountNum) {
      alert("Insufficient USDC balance");
      return;
    }

    setIsComposing(true);
    try {
      // Convert amount to smallest unit (assuming 2 decimals for USDC)
      const amountInSmallestUnit = Math.floor(amountNum * 100);

      // TODO: Select real payment coin from user's SUI balance
      // For now, this is a placeholder - real implementation would:
      // 1. Query user's SUI coins
      // 2. Select appropriate coin for payment
      const paymentCoinId = "0xplaceholder-coin-id";

      // TODO: Create or select spend guard for the service provider
      // For now, this is a placeholder
      const guardId = "0xplaceholder-guard-id";

      const nftId = await purchaseService(
        guardId,
        paymentCoinId,
        serviceId.trim(),
        amountInSmallestUnit,
        creditsNum
      );

      if (nftId) {
        alert(`PTB executed successfully! AccessNFT ID: ${nftId}`);
        // Reset form
        setServiceId("");
        setAmount("0.00");
        setCredits("5");
      } else {
        alert("Failed to execute PTB");
      }
    } catch (error) {
      console.error("PTB execution failed:", error);
      alert("Failed to execute programmable transaction");
    } finally {
      setIsComposing(false);
    }
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
            placeholder="e.g., flight-orchestrator"
            className="rounded-full border border-border/50 bg-background px-4 py-2 text-sm"
            disabled={isComposing}
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
            step="0.01"
            onChange={(event) => setAmount(event.target.value)}
            className="rounded-full border border-border/50 bg-background px-4 py-2 text-sm"
            disabled={isComposing}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Credits
          </label>
          <input
            value={credits}
            type="number"
            min="1"
            onChange={(event) => setCredits(event.target.value)}
            className="rounded-full border border-border/50 bg-background px-4 py-2 text-sm"
            disabled={isComposing}
          />
        </div>
        {connectedAccount && (
          <div className="text-xs text-muted-foreground">
            Balance: {balances.USDC?.toFixed(2) || "0.00"} USDC
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={handleCompose}
          disabled={isComposing || !connectedAccount}
        >
          {isComposing ? "Composing PTB..." : "Compose PTB"}
        </Button>
      </CardFooter>
    </Card>
  );
};

