"use client";

import { create } from "zustand";
import { SuiClient } from "@mysten/sui/client";
import { AgentCommerceContract } from "@/lib/contracts";
import { suiClient, ServiceProfile, AccessNFT, ReputationNFT } from "@/lib/sui";
import { executeTransaction } from "@/lib/transaction-executor";

type ContractState = {
  client: SuiClient;
  contract: AgentCommerceContract;
  registryId: string | null;
  services: ServiceProfile[];
  accessNfts: AccessNFT[];
  reputationNft: ReputationNFT | null;

  // Actions
  setRegistryId: (id: string) => void;
  loadServices: () => Promise<void>;
  loadAccessNfts: (owner: string) => Promise<void>;
  loadReputationNft: (agentAddress: string) => Promise<void>;
  registerAgent: (
    agentId: string,
    description: string,
    pricing: { model_type: number; amount: number },
    reputationNftId: string,
    serviceEndpoint: string,
    signerAddress: string
  ) => Promise<void>;
  purchaseService: (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ) => Promise<string | null>;
  consumeCredit: (accessNftId: string, clockId: string, caller: string) => Promise<void>;
  provideFeedback: (
    reputationNftId: string,
    feedbackAuthorityId: string,
    isPositive: boolean
  ) => Promise<void>;
};

export const useContractStore = create<ContractState>((set, get) => ({
  client: suiClient,
  contract: new AgentCommerceContract(suiClient),
  registryId: null,
  services: [],
  accessNfts: [],
  reputationNft: null,

  setRegistryId: (id) => set({ registryId: id }),

  loadServices: async () => {
    const { registryId } = get();
    if (!registryId) return;

    try {
      // This would need to query all agents from the registry
      // For now, using mock data
      const services: ServiceProfile[] = [
        {
          owner: "0x123...",
          description: "Flight booking and reservation service",
          pricing: { model_type: 0, amount: 100 }, // PER_CREDIT
          reputation: "0x456...",
          service_endpoint: "https://api.flight-service.com",
        },
        // Add more services...
      ];
      set({ services });
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  },

  loadAccessNfts: async (owner: string) => {
    try {
      // Query owned AccessNFTs from Sui
      // This would require querying the user's objects and filtering for AccessNFTs
      const accessNfts: AccessNFT[] = [
        {
          id: "0x789...",
          service_id: "flight-service",
          owner,
          credits_remaining: 5,
          tier: 1,
        },
        // Add more NFTs...
      ];
      set({ accessNfts });
    } catch (error) {
      console.error("Failed to load AccessNFTs:", error);
    }
  },

  loadReputationNft: async (agentAddress: string) => {
    try {
      // Query reputation NFT for the agent
      const reputationNft: ReputationNFT = {
        id: "0xabc...",
        agent: agentAddress,
        total_interactions: 10,
        positive: 8,
        negative: 2,
        last_feedback: Date.now(),
      };
      set({ reputationNft });
    } catch (error) {
      console.error("Failed to load reputation NFT:", error);
    }
  },

  registerAgent: async (
    agentId: string,
    description: string,
    pricing: { model_type: number; amount: number },
    reputationNftId: string,
    serviceEndpoint: string,
    signerAddress: string
  ) => {
    const { registryId, contract } = get();
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
      await get().loadServices();
    } catch (error) {
      console.error("Failed to register agent:", error);
      throw error;
    }
  },

  purchaseService: async (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ): Promise<string | null> => {
    const { contract } = get();

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
  },

  consumeCredit: async (accessNftId: string, clockId: string, caller: string) => {
    const { contract } = get();

    try {
      const tx = await contract.consumeCredit(accessNftId, clockId, caller);

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Consume credit transaction completed:", result.digest);

      // Refresh AccessNFTs after consumption
      await get().loadAccessNfts(caller);
    } catch (error) {
      console.error("Failed to consume credit:", error);
      throw error;
    }
  },

  provideFeedback: async (
    reputationNftId: string,
    feedbackAuthorityId: string,
    isPositive: boolean
  ) => {
    const { contract } = get();

    try {
      const tx = isPositive
        ? await contract.addPositiveFeedback(reputationNftId, feedbackAuthorityId, Date.now())
        : await contract.addNegativeFeedback(reputationNftId, feedbackAuthorityId, Date.now());

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Feedback transaction completed:", result.digest);

      // Refresh reputation data
      const { reputationNft } = get();
      if (reputationNft) {
        await get().loadReputationNft(reputationNft.agent);
      }
    } catch (error) {
      console.error("Failed to provide feedback:", error);
      throw error;
    }
  },
}));
