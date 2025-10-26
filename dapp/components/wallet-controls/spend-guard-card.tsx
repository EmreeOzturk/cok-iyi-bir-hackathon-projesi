"use client";

import { useState } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useContractTransactions } from "@/stores/use-contract-transactions";
import { Loader2 } from "lucide-react";

export const SpendGuardCard = () => {
  const account = useCurrentAccount();
  const { createSpendGuard } = useContractTransactions(null);

  const [isCreating, setIsCreating] = useState(false);
  const [maxPerTx, setMaxPerTx] = useState("1000000000"); // 1 SUI in MIST
  const [recipient, setRecipient] = useState(account?.address || "");
  const [createdGuardId, setCreatedGuardId] = useState<string | null>(null);

  const handleCreateSpendGuard = async () => {
    if (!account) {
      alert("Lütfen önce cüzdanınızı bağlayın.");
      return;
    }

    if (!maxPerTx || !recipient) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsCreating(true);
    try {
      const guardId = await createSpendGuard(
        parseInt(maxPerTx),
        recipient
      );

      if (guardId) {
        setCreatedGuardId(guardId);
        alert(`Spend Guard başarıyla oluşturuldu!\nGuard ID: ${guardId}`);
      } else {
        alert("Spend Guard oluşturuldu ancak ID alınamadı.");
      }
    } catch (error) {
      console.error("Spend Guard oluşturma hatası:", error);
      alert(`Spend Guard oluşturma başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsCreating(false);
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
        {!account ? (
          <div className="rounded-2xl border border-border/50 bg-muted/40 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Spend Guard oluşturmak için cüzdanınızı bağlayın.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxPerTx">Maksimum İşlem Tutarı (MIST)</Label>
              <Input
                id="maxPerTx"
                type="number"
                value={maxPerTx}
                onChange={(e) => setMaxPerTx(e.target.value)}
                placeholder="1000000000 (1 SUI)"
              />
              <p className="text-xs text-muted-foreground">
                Bir işlemde harcanabilecek maksimum tutar (MIST cinsinden)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Alıcı Adresi</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
              <p className="text-xs text-muted-foreground">
                Ödemelerin gönderileceği adres
              </p>
            </div>

            <Button
              onClick={handleCreateSpendGuard}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                "Spend Guard Oluştur"
              )}
            </Button>

            {createdGuardId && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Spend Guard Oluşturuldu!
                </p>
                <p className="mt-1 text-xs text-green-700 break-all">
                  ID: {createdGuardId}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

