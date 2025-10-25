"use client";

import { useEffect, useState } from "react";
import { ServiceGrid } from "./service-grid";
import { useAgentStore } from "@/stores/use-agent-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  CheckCircleIcon,
  UsersIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export function ServiceMarketplaceShell() {
  const {
    selectedAgent,
    clearSelection,
    fetchAgents,
    agents,
  } = useAgentStore();

  // Load agents on mount
  useEffect(() => {
    if (agents.length === 0) {
      fetchAgents();
    }
  }, [agents.length, fetchAgents]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Main Grid - Takes 2/3 on desktop */}
      <div className="flex-1 lg:w-2/3">
        <ServiceGrid />
      </div>

      {/* Agent Detail Panel - 1/3 on desktop */}
      <div className="w-full lg:w-1/3">
        {selectedAgent ? (
          <div className="sticky top-20 space-y-6">
            {/* Card Container */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg space-y-6">
              {/* Close Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Agent Details</h2>
                <button
                  onClick={clearSelection}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Agent Name & Verified */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-3xl font-bold text-foreground">
                    {selectedAgent.agent_name}
                  </h3>
                  {selectedAgent.verified && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 flex items-center gap-1 shrink-0">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {selectedAgent.owner?.slice(0, 10)}...{selectedAgent.owner?.slice(-8)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Reputation Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Reputation Score
                </h4>
                <div className="flex items-end gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          className={`h-6 w-6 ${
                            i <= Math.floor(selectedAgent.reputation_score ?? 0)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-4xl font-bold text-primary">
                      {selectedAgent.reputation_score?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">/5.0</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Active Users */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Active Users</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedAgent.active_users
                      ? `${(selectedAgent.active_users / 1000).toFixed(1)}k`
                      : "0"}
                  </p>
                </div>

                {/* Services Delivered */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <SparklesIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Delivered</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedAgent.total_services_delivered?.toLocaleString() ?? "0"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Description */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  About This Agent
                </h4>
                <p className="text-foreground leading-relaxed">
                  {selectedAgent.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Per Credit Cost</p>
                <p className="text-3xl font-bold text-primary">
                  {(selectedAgent.pricing.amount / 1000).toFixed(2)} USDC
                </p>
                <p className="text-xs text-muted-foreground">
                  Pricing Model: {getPricingLabel(selectedAgent.pricing.model_type)}
                </p>
              </div>

              {/* Service Endpoint */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  API Endpoint
                </h4>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 font-mono text-xs text-foreground break-all">
                  {selectedAgent.service_endpoint}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-12 text-base font-semibold">
                  Purchase Access
                </Button>
                <Button variant="outline" className="w-full">
                  View Full Profile
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 justify-center text-xs text-green-600 bg-green-500/5 rounded-lg px-3 py-2 border border-green-500/20">
                <CheckCircleIcon className="h-3 w-3" />
                <span>Secured by SuiPay Protocol</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-20 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Select an Agent
            </h3>
            <p className="text-sm text-muted-foreground">
              Click on an agent card to view detailed information and pricing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get pricing label
function getPricingLabel(modelType: number): string {
  switch (modelType) {
    case 0:
      return "Per Credit";
    case 1:
      return "Subscription";
    case 2:
      return "Free";
    default:
      return "Unknown";
  }
}

