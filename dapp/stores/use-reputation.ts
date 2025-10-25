"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { useTransactionExecutor } from "@/lib/transaction-executor";
import type { ReputationNFT } from "@/lib/types";
import { createMockReputationNFT } from "@/lib/mock-data";

export function useReputation() {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const [reputationNft, setReputationNft] = useState<ReputationNFT | null>(null);

  const loadReputationNft = useCallback(async (agentAddress: string) => {
    try {
      // For now, use mock data until contracts are deployed
      // In production, this would query the actual reputation NFT
      const mockReputationNft = createMockReputationNFT(agentAddress);
      setReputationNft(mockReputationNft);
    } catch (error) {
      console.error("Failed to load reputation NFT:", error);
      setReputationNft(null);
    }
  }, []);

  const provideFeedback = useCallback(async (
    reputationNftId: string,
    feedbackAuthorityId: string,
    isPositive: boolean
  ) => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = isPositive
        ? await contract.addPositiveFeedback(reputationNftId, feedbackAuthorityId, Date.now())
        : await contract.addNegativeFeedback(reputationNftId, feedbackAuthorityId, Date.now());

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Feedback transaction completed:", result.digest);

      // Refresh reputation data
      if (reputationNft) {
        await loadReputationNft(reputationNft.agent);
      }
    } catch (error) {
      console.error("Failed to provide feedback:", error);
      throw error;
    }
  }, [client, executeTransaction, reputationNft, loadReputationNft]);

  return {
    reputationNft,
    loadReputationNft,
    provideFeedback,
  };
}
