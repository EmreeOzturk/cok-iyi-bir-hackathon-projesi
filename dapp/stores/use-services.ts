"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import type { ServiceProfile } from "@/lib/types";
import { MOCK_SERVICES } from "@/lib/mock-data";

export function useServices(registryId: string | null) {
  const client = useSuiClient();
  const [services, setServices] = useState<ServiceProfile[]>([]);

  const loadServices = useCallback(async () => {
    if (!registryId) return;

    try {
      // For now, use mock data until contracts are deployed
      // In production, this would query the actual agent registry
      setServices(MOCK_SERVICES);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServices([]);
    }
  }, [registryId]);

  return {
    services,
    loadServices,
  };
}
