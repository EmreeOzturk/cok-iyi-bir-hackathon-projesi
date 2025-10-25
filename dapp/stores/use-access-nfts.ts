"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { useTransactionExecutor } from "@/lib/transaction-executor";
import type { AccessNFT } from "@/lib/types";
import { createMockAccessNFTs } from "@/lib/mock-data";

export function useAccessNFTs() {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const [accessNfts, setAccessNfts] = useState<AccessNFT[]>([]);

  const loadAccessNfts = useCallback(async (owner: string) => {
    try {
      // For now, use mock data until contracts are deployed
      // In production, this would query actual AccessNFTs owned by the user
      const mockAccessNfts = createMockAccessNFTs(owner);
      setAccessNfts(mockAccessNfts);
    } catch (error) {
      console.error("Failed to load AccessNFTs:", error);
      setAccessNfts([]);
    }
  }, []);

  const consumeCredit = useCallback(async (accessNftId: string, clockId: string, caller: string) => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.consumeCredit(accessNftId, clockId, caller);

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Consume credit transaction completed:", result.digest);

      // Refresh AccessNFTs after consumption
      await loadAccessNfts(caller);
    } catch (error) {
      console.error("Failed to consume credit:", error);
      throw error;
    }
  }, [client, executeTransaction, loadAccessNfts]);

  return {
    accessNfts,
    loadAccessNfts,
    consumeCredit,
  };
}
