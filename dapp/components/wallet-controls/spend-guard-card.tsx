"use client";

import { useState, useEffect } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";

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

export const SpendGuardCard = () => {
  const {
    connectedAccount,
    dailyLimit,
    spendGuardId,
    createSpendGuard,
    updateSpendGuardLimit
  } = useWalletStore();
  const [pendingLimit, setPendingLimit] = useState(dailyLimit.toString());
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setPendingLimit(dailyLimit.toString());
  }, [dailyLimit]);

  const handleCreateSpendGuard = async () => {
    if (!connectedAccount) {
      alert("Please connect your wallet first");
      return;
    }

    const limit = Number.parseFloat(pendingLimit);
    if (limit <= 0) {
      alert("Please enter a valid limit");
      return;
    }

    setIsCreating(true);
    try {
      const guardId = await createSpendGuard(limit);
      if (guardId) {
        alert(`Spend guard created successfully! Guard ID: ${guardId}`);
      } else {
        alert("Failed to create spend guard");
      }
    } catch (error) {
      console.error("Failed to create spend guard:", error);
      alert("Failed to create spend guard");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateLimit = async () => {
    if (!spendGuardId) {
      alert("No spend guard found. Please create one first.");
      return;
    }

    const limit = Number.parseFloat(pendingLimit);
    if (limit <= 0) {
      alert("Please enter a valid limit");
      return;
    }

    setIsUpdating(true);
    try {
      await updateSpendGuardLimit(spendGuardId, limit);
      alert("Spend guard limit updated successfully!");
    } catch (error) {
      console.error("Failed to update spend guard:", error);
      alert("Failed to update spend guard limit");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Spend Guard</CardTitle>
          <CardDescription>
            PTB işlemleri için maksimum tutarı sınırlandırarak ajanınızı güvenceye alın.
          </CardDescription>
        </div>
        <BoltIcon className="h-8 w-8 text-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border/50 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Günlük limit
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {dailyLimit.toLocaleString()} USDC
          </p>
          {spendGuardId && (
            <p className="mt-1 text-xs text-muted-foreground">
              Guard ID: {spendGuardId}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <input
            type="number"
            min="0"
            step="0.01"
            value={pendingLimit}
            onChange={(event) => setPendingLimit(event.target.value)}
            className="flex-1 rounded-full border border-border/50 bg-background px-4 py-2"
            disabled={isCreating || isUpdating}
          />
          {spendGuardId ? (
            <Button
              onClick={handleUpdateLimit}
              disabled={isUpdating || !connectedAccount}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          ) : (
            <Button
              onClick={handleCreateSpendGuard}
              disabled={isCreating || !connectedAccount}
            >
              {isCreating ? "Creating..." : "Create Guard"}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Limit değişiklikleri AccessNFT paylaşımlı SpendGuard objesine yansır ve zincir üstü ödeme modülünde enforce edilir.
        </p>
      </CardFooter>
    </Card>
  );
};

