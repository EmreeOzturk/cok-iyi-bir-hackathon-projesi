"use client";

import { useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { useTransactionExecutor } from "@/lib/transaction-executor";

export function useContractTransactions(registryId: string | null) {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const registerAgent = useCallback(async (
    agentId: string,
    agentName: string,
    description: string,
    pricing: { model_type: number; amount: number },
    reputationNftId: string,
    serviceEndpoint: string,
    signerAddress: string
  ) => {
    if (!registryId) throw new Error("Registry not initialized");

    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.registerAgent(
        registryId,
        agentId,
        agentName,
        signerAddress,
        description,
        pricing,
        reputationNftId,
        serviceEndpoint,
        signerAddress
      );

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Agent registration completed:", result.digest);

      return result;
    } catch (error) {
      console.error("Failed to register agent:", error);
      throw error;
    }
  }, [registryId, client, executeTransaction]);

  const purchaseService = useCallback(async (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ): Promise<string | null> => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.payAndIssue(
        guardId,
        paymentCoinId,
        amount,
        serviceId,
        credits
      );

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Purchase transaction completed:", result.digest);

      // TODO: Extract NFT ID from transaction effects
      // The transaction should create an AccessNFT object
      // For now, this is a placeholder
      return "0xplaceholder-nft-id";
    } catch (error) {
      console.error("Failed to purchase service:", error);
      return null;
    }
  }, [client, executeTransaction]);

  const purchaseServicePTB = useCallback(async (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ): Promise<string | null> => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.payAndIssuePTB(
        guardId,
        paymentCoinId,
        amount,
        serviceId,
        credits
      );

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("PTB Purchase transaction completed:", result.digest);

      // Extract NFT ID from transaction effects
      // In a real implementation, you'd parse the effects to get the created NFT ID
      return "0xnew-ptb-nft-id";
    } catch (error) {
      console.error("Failed to purchase service with PTB:", error);
      return null;
    }
  }, [client, executeTransaction]);

  return {
    registerAgent,
    purchaseService,
    purchaseServicePTB,
  };
}
