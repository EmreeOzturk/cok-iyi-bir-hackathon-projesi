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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContractStore } from "@/stores/use-contract-store";
import { useWalletStore } from "@/stores/use-wallet-store";

type ServiceCardProps = {
  service: {
    name: string;
    description: string;
    price: string;
    tier: string;
    reputation: number;
  };
};

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const { purchaseService } = useContractStore();
  const { spendGuardId, connectedAccount, balances } = useWalletStore();

  const handleMintAccessNFT = async () => {
    if (!connectedAccount || !spendGuardId) {
      alert("Please connect your wallet and create a spend guard first");
      return;
    }

    setIsMinting(true);
    try {
      // Parse price from service.price (e.g., "0.42 USDC" -> 42)
      const priceMatch = service.price.match(/(\d+\.?\d*)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) * 100 : 42; // Convert to smallest unit

      // Check if user has enough balance
      if (balances.USDC < price / 100) {
        alert("Insufficient USDC balance");
        return;
      }

      // Mock payment coin ID (would be selected from user's coins)
      const paymentCoinId = "0xmock-coin-id";

      const nftId = await purchaseService(
        spendGuardId,
        paymentCoinId,
        service.name.toLowerCase().replace(/\s+/g, '-'),
        price,
        5 // Default 5 credits
      );

      if (nftId) {
        alert(`AccessNFT minted successfully! NFT ID: ${nftId}`);
      } else {
        alert("Failed to mint AccessNFT");
      }
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Failed to mint AccessNFT");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {service.name}
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {service.tier}
          </Badge>
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>
          Reputation Score:
          <span className="ml-2 rounded-full bg-foreground/10 px-2 py-1 text-xs font-medium text-foreground">
            {service.reputation.toFixed(1)} / 5
          </span>
        </p>
        <p>
          Mastra orchestrator bu ajanı AccessNFT credential&apos;larıyla otomatik doğrular.
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{service.price} / credit</span>
        <Button
          variant="primary"
          onClick={handleMintAccessNFT}
          disabled={isMinting || !connectedAccount || !spendGuardId}
        >
          {isMinting ? "Minting..." : "Mint AccessNFT"}
        </Button>
      </CardFooter>
    </Card>
  );
};

