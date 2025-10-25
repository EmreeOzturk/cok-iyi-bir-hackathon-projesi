"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContractStore } from "@/stores/use-contract-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { formatAddress } from "@/lib/sui";

export const ServiceUsageList = () => {
  const { accessNfts, loadAccessNfts, consumeCredit } = useContractStore();
  const { connectedAccount } = useWalletStore();

  useEffect(() => {
    if (connectedAccount) {
      loadAccessNfts(connectedAccount);
    }
  }, [connectedAccount, loadAccessNfts]);

  const handleConsumeCredit = async (accessNftId: string) => {
    if (!connectedAccount) return;

    try {
      // Mock clock ID (would be a real clock object on Sui)
      const clockId = "0x6";
      await consumeCredit(accessNftId, clockId, connectedAccount);
      alert("Credit consumed successfully!");
      // Reload AccessNFTs to reflect changes
      loadAccessNfts(connectedAccount);
    } catch (error) {
      console.error("Failed to consume credit:", error);
      alert("Failed to consume credit");
    }
  };

  // Show loading state or empty state
  if (!connectedAccount) {
    return (
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>AccessNFT Utilisation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please connect your wallet to view AccessNFTs
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No wallet connected
          </div>
        </CardContent>
      </Card>
    );
  }

  if (accessNfts.length === 0) {
    return (
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>AccessNFT Utilisation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ajansız kullanım senaryosunda hangi L2 ajanların kiralandığını takip edin.
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No AccessNFTs found. Purchase services to see them here.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle>AccessNFT Utilisation</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ajansız kullanım senaryosunda hangi L2 ajanların kiralandığını takip edin.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {accessNfts.map((nft) => (
          <div
            key={nft.id}
            className="flex items-center justify-between rounded-2xl border border-border/50 px-5 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {nft.service_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatAddress(nft.id)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Tier: {nft.tier}</Badge>
              <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
                {nft.credits_remaining} credits
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleConsumeCredit(nft.id)}
                disabled={nft.credits_remaining <= 0}
              >
                Consume
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

