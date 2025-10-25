import { ShieldCheckIcon } from "@heroicons/react/24/outline";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReputationSummaryCard = () => (
  <Card className="col-span-1">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Reputation Vector</CardTitle>
      <ShieldCheckIcon className="h-6 w-6 text-emerald-500" />
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <div className="flex items-center justify-between rounded-2xl bg-foreground/10 px-4 py-3 text-foreground">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]">İşlem başarı oranı</p>
          <p className="text-2xl font-semibold">96.7%</p>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.3em] text-foreground/80">
          480 pozitif · 18 negatif
        </div>
      </div>
      <p>
        Soulbound ReputationNFT dinamik alanları 10 saniye önce güncellendi. Olumsuz sinyaller Mastra ajan orkestratörüne push notification olarak düşüyor.
      </p>
      <p>
        On-chain reputation threshold aşıldığında otomatik fiyat optimizasyonu tetiklenecek.
      </p>
    </CardContent>
  </Card>
);

