"use client";

import { useRegistry } from "./use-registry";
import { useServices } from "./use-services";
import { useAccessNFTs } from "./use-access-nfts";
import { useReputation } from "./use-reputation";
import { useContractTransactions } from "./use-contract-transactions";

// Main hook that composes all contract-related functionality
export function useContractStore() {
  const registry = useRegistry();
  const services = useServices(registry.registryId);
  const accessNFTs = useAccessNFTs();
  const reputation = useReputation();
  const transactions = useContractTransactions(registry.registryId);

  return {
    // Registry state and actions
    registryId: registry.registryId,
    setRegistryId: registry.setRegistryId,
    createRegistry: registry.createRegistry,

    // Services state and actions
    services: services.services,
    loadServices: services.loadServices,

    // Access NFTs state and actions
    accessNfts: accessNFTs.accessNfts,
    loadAccessNfts: accessNFTs.loadAccessNfts,
    consumeCredit: accessNFTs.consumeCredit,

    // Reputation state and actions
    reputationNft: reputation.reputationNft,
    loadReputationNft: reputation.loadReputationNft,
    provideFeedback: reputation.provideFeedback,

    // Transaction actions
    registerAgent: transactions.registerAgent,
    purchaseService: transactions.purchaseService,
    purchaseServicePTB: transactions.purchaseServicePTB,
  };
}
