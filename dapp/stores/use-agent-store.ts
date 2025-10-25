"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import type { AgentWithReputation } from "@/lib/types";

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
            type: '0x2::object::ID',
            value: agentId,
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
            // TODO: Calculate these from reputation data
            reputation_score: 0,
            verified: false,
            active_users: 0,
            total_services_delivered: 0,
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
