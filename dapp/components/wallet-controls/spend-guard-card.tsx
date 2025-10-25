"use client";

import { useState } from "react";
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
  const { dailyLimit, setDailyLimit } = useWalletStore();
  const [pendingLimit, setPendingLimit] = useState(dailyLimit.toString());

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
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <input
            type="number"
            min="0"
            value={pendingLimit}
            onChange={(event) => setPendingLimit(event.target.value)}
            className="flex-1 rounded-full border border-border/50 bg-background px-4 py-2"
          />
          <Button
            onClick={() => setDailyLimit(Number.parseFloat(pendingLimit))}
          >
            Update limit
          </Button>
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

