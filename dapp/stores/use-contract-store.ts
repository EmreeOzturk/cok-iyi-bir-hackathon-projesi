"use client";

import { useRegistry } from "./use-registry";
import { useServices } from "./use-services";
import { useAccessNFTs } from "./use-access-nfts";
import { useReputation } from "./use-reputation";
import { useAgentStore } from "./use-agent-store";
import { useContractTransactions } from "./use-contract-transactions";

// Main hook that composes all contract-related functionality
export function useContractStore() {
  const registry = useRegistry();
  const services = useServices(registry.registryId);
  const accessNFTs = useAccessNFTs();
  const reputation = useReputation();
  const agentStore = useAgentStore(registry.registryId);
  const transactions = useContractTransactions(registry.registryId);

  return {
    // Registry state and actions
    registryId: registry.registryId,
    setRegistryId: registry.setRegistryId,
    createRegistry: registry.createRegistry,

    // Agents state and actions
    agents: agentStore.agents,
    selectedAgent: agentStore.selectedAgent,
    fetchAgents: agentStore.fetchAgents,
    selectAgent: agentStore.selectAgent,
    clearSelection: agentStore.clearSelection,
    agentsLoading: agentStore.isLoading,
    agentsError: agentStore.error,

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
