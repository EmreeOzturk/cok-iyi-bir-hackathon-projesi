"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { CONTRACT_CONFIG } from "@/lib/config";
import type { AgentWithReputation } from "@/lib/types";

type ReputationNFTMetrics = {
  total_interactions: number;
  basarili_islem: number;
  positive: number;
  negative: number;
  last_feedback: { Some: number } | null;
};

// Helper functions for reputation calculation
function calculateReputationScore(metrics: ReputationNFTMetrics): number {
  if (metrics.total_interactions === 0) return 0;

  const positiveScore = metrics.positive * 1.0;
  const negativeScore = metrics.negative * -0.5;
  const successBonus = metrics.basarili_islem * 0.2;

  const rawScore = (positiveScore + negativeScore + successBonus) / metrics.total_interactions;

  // Normalize to 0-100 scale
  return Math.max(0, Math.min(100, (rawScore + 1) * 50));
}

function isAgentVerified(metrics: ReputationNFTMetrics): boolean {
  // Agent is verified if they have:
  // - At least 10 total interactions
  // - At least 70% positive feedback ratio
  // - At least 5 successful operations
  const minInteractions = 10;
  const minSuccessRate = 0.7;
  const minSuccessfulOperations = 5;

  const totalFeedback = metrics.positive + metrics.negative;
  const positiveRatio = totalFeedback > 0 ? metrics.positive / totalFeedback : 0;

  return (
    metrics.total_interactions >= minInteractions &&
    positiveRatio >= minSuccessRate &&
    metrics.basarili_islem >= minSuccessfulOperations
  );
}

export function useAgentStore(registryId: string | null) {
  const client = useSuiClient();
  const [agents, setAgents] = useState<AgentWithReputation[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithReputation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!registryId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Query the agent registry for all registered agents
      const dynamicFields = await client.getDynamicFields({
        parentId: registryId,
      });

      const agentsList: AgentWithReputation[] = [];

      for (const field of dynamicFields.data) {
        const agentId = field.name.value as string;

        // Get the agent profile from dynamic field
        const profileObj = await client.getDynamicFieldObject({
          parentId: registryId,
          name: {
            type: `${CONTRACT_CONFIG.PACKAGE_ID}::agent_registry::ProfileKey`,
            value: {
              id: agentId
            },
          },
        });

        if (profileObj.data?.content?.dataType === 'moveObject') {
          const fields = profileObj.data.content.fields as {
            agent_name: string;
            owner: string;
            description: string;
            pricing: { fields: { model_type: number; amount: number } };
            reputation: string;
            service_endpoint: string;
          };

          // Fetch reputation metrics for this agent
          let reputationMetrics: ReputationNFTMetrics = {
            total_interactions: 0,
            basarili_islem: 0,
            positive: 0,
            negative: 0,
            last_feedback: null,
          };

          try {
            // Query for ReputationNFT owned by this agent
            const reputationObjects = await client.getOwnedObjects({
              owner: fields.owner,
              filter: {
                StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::ReputationNFT`
              },
              options: { showContent: true }
            });

            if (reputationObjects.data.length > 0) {
              const reputationObj = reputationObjects.data[0];
              if (reputationObj.data?.content?.dataType === 'moveObject') {

                // Get metrics from dynamic field
                try {
                  const metricsObj = await client.getDynamicFieldObject({
                    parentId: reputationObj.data.objectId,
                    name: {
                      type: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::Metrics`,
                      value: {}
                    }
                  });

                  if (metricsObj.data?.content?.dataType === 'moveObject') {
                    reputationMetrics = metricsObj.data.content.fields as ReputationNFTMetrics;
                  }
                } catch {
                  // Reputation metrics not available, use defaults
                  console.log(`No reputation metrics found for agent ${fields.owner}`);
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch reputation for agent ${fields.owner}:`, error);
          }

          agentsList.push({
            id: agentId,
            agent_name: fields.agent_name,
            owner: fields.owner,
            description: fields.description,
            pricing: {
              model_type: fields.pricing.fields.model_type,
              amount: fields.pricing.fields.amount,
            },
            reputation: fields.reputation,
            service_endpoint: fields.service_endpoint,
            // Calculate reputation metrics
            reputation_score: calculateReputationScore(reputationMetrics),
            verified: isAgentVerified(reputationMetrics),
            active_users: reputationMetrics.total_interactions,
            total_services_delivered: reputationMetrics.basarili_islem,
          });
        }
      }

      setAgents(agentsList);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch agents";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [registryId, client]);

  const selectAgent = useCallback((agent: AgentWithReputation) => {
    setSelectedAgent(agent);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedAgent(null);
  }, []);

  return {
    agents,
    selectedAgent,
    isLoading,
    error,
    fetchAgents,
    selectAgent,
    clearSelection,
  };
}
