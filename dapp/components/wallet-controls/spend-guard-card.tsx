"use client";

import { BoltIcon } from "@heroicons/react/24/outline";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SpendGuardCard = () => {
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
        <div className="rounded-2xl border border-border/50 bg-muted/40 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Spend Guard özelliği henüz uygulanmadı.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Yakında gelecek...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

