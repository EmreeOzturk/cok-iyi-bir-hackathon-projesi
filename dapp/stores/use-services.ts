"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import type { ServiceProfile } from "@/lib/types";

type ServiceProfileFields = {
  agent_name: string;
  owner: string;
  description: string;
  pricing: { fields: { model_type: number; amount: number } };
  reputation: string;
  service_endpoint: string;
};

export function useServices(registryId: string | null) {
  const client = useSuiClient();
  const [services, setServices] = useState<ServiceProfile[]>([]);

  const loadServices = useCallback(async () => {
    if (!registryId) return;

    try {
      // Query the agent registry for all registered services
      const dynamicFields = await client.getDynamicFields({
        parentId: registryId,
      });

      const servicesList: ServiceProfile[] = [];

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
          const fields = profileObj.data.content.fields as ServiceProfileFields;
          servicesList.push({
            agent_name: fields.agent_name,
            owner: fields.owner,
            description: fields.description,
            pricing: {
              model_type: fields.pricing.fields.model_type,
              amount: fields.pricing.fields.amount,
            },
            reputation: fields.reputation,
            service_endpoint: fields.service_endpoint,
          });
        }
      }

      setServices(servicesList);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServices([]);
    }
  }, [registryId, client]);

  return {
    services,
    loadServices,
  };
}
