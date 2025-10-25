"use client";

import { useState, useCallback, useMemo } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { ServiceProfile, AccessNFT, ReputationNFT } from "@/lib/sui";
import { useTransactionExecutor } from "@/lib/transaction-executor";

export function useContractStore() {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const [registryId, setRegistryId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceProfile[]>([]);
  const [accessNfts, setAccessNfts] = useState<AccessNFT[]>([]);
  const [reputationNft, setReputationNft] = useState<ReputationNFT | null>(null);

  // Create contract instance with current client
  const contract = useMemo(() => new AgentCommerceContract(client), [client]);

  const loadServices = useCallback(async () => {
    if (!registryId) return;

    try {
      // This would need to query all agents from the registry
      // For now, using mock data
      const mockServices: ServiceProfile[] = [
        {
          owner: "0x123...",
          description: "Flight booking and reservation service",
          pricing: { model_type: 0, amount: 100 }, // PER_CREDIT
          reputation: "0x456...",
          service_endpoint: "https://api.flight-service.com",
        },
        {
          owner: "0x789...",
          description: "Hotel reservation and booking service",
          pricing: { model_type: 0, amount: 150 }, // PER_CREDIT
          reputation: "0xabc...",
          service_endpoint: "https://api.hotel-service.com",
        },
        {
          owner: "0xdef...",
          description: "Restaurant recommendations and reservations",
          pricing: { model_type: 0, amount: 75 }, // PER_CREDIT
          reputation: "0xfed...",
          service_endpoint: "https://api.restaurant-service.com",
        },
      ];
      setServices(mockServices);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  }, [registryId]);

  const loadAccessNfts = useCallback(async (owner: string) => {
    try {
      // Query owned AccessNFTs from Sui
      // This would require querying the user's objects and filtering for AccessNFTs
      const mockAccessNfts: AccessNFT[] = [
        {
          id: "0x789...",
          service_id: "flight-service",
          owner,
          credits_remaining: 5,
          tier: 1,
        },
        {
          id: "0xdef...",
          service_id: "hotel-service",
          owner,
          credits_remaining: 3,
          tier: 1,
        },
      ];
      setAccessNfts(mockAccessNfts);
    } catch (error) {
      console.error("Failed to load AccessNFTs:", error);
    }
  }, []);

  const loadReputationNft = useCallback(async (agentAddress: string) => {
    try {
      // Query reputation NFT for the agent
      const mockReputationNft: ReputationNFT = {
        id: "0xabc...",
        agent: agentAddress,
        total_interactions: 10,
        positive: 8,
        negative: 2,
        last_feedback: Date.now(),
      };
      setReputationNft(mockReputationNft);
    } catch (error) {
      console.error("Failed to load reputation NFT:", error);
    }
  }, []);

  const registerAgent = useCallback(async (
    agentId: string,
    description: string,
    pricing: { model_type: number; amount: number },
    reputationNftId: string,
    serviceEndpoint: string,
    signerAddress: string
  ) => {
    if (!registryId) throw new Error("Registry not initialized");

    try {
      const tx = await contract.registerAgent(
        registryId,
        agentId,
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

      // Refresh services after registration
      await loadServices();
    } catch (error) {
      console.error("Failed to register agent:", error);
      throw error;
    }
  }, [registryId, contract, executeTransaction, loadServices]);

  const purchaseService = useCallback(async (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ): Promise<string | null> => {
    try {
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

      // Extract NFT ID from transaction effects (would need to parse the actual effects)
      // For now, return a mock ID
      return "0xnew-nft-id";
    } catch (error) {
      console.error("Failed to purchase service:", error);
      return null;
    }
  }, [contract, executeTransaction]);

  const consumeCredit = useCallback(async (accessNftId: string, clockId: string, caller: string) => {
    try {
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
  }, [contract, executeTransaction, loadAccessNfts]);

  const provideFeedback = useCallback(async (
    reputationNftId: string,
    feedbackAuthorityId: string,
    isPositive: boolean
  ) => {
    try {
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
  }, [contract, executeTransaction, reputationNft, loadReputationNft]);

  return {
    // State
    registryId,
    services,
    accessNfts,
    reputationNft,

    // Actions
    setRegistryId,
    loadServices,
    loadAccessNfts,
    loadReputationNft,
    registerAgent,
    purchaseService,
    consumeCredit,
    provideFeedback,
  };
}
