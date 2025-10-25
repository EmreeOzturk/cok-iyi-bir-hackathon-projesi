"use client";

import { useEffect } from "react";
import { ServiceCard } from "./service-card";
import { useAgentStore } from "@/stores/use-agent-store";

export function ServiceGrid() {
  const {
    agents,
    fetchAgents,
    isLoading,
    error,
    selectAgent,
  } = useAgentStore();

  // Load agents on mount
  useEffect(() => {
    if (agents.length === 0) {
      fetchAgents();
    }
  }, [agents.length, fetchAgents]);

  return (
    <div className="space-y-8">

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-6 text-center">
          <p className="text-red-600 font-medium">Error loading agents</p>
          <p className="text-red-600/70 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && agents.length === 0 && !error && (
        <div className="rounded-lg bg-muted/50 border border-border p-12 text-center">
          <p className="text-muted-foreground font-medium">No agents found</p>
          <p className="text-muted-foreground text-sm mt-1">
            No agents are currently available.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <ServiceCard
              key={agent.id}
              agent={agent}
              onSelect={selectAgent}
              onPurchase={(agent) => {
                selectAgent(agent);
                // TODO: Trigger purchase flow
                console.log("Purchase clicked for:", agent.agent_name);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

