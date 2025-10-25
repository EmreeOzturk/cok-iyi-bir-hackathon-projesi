"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  StarIcon, 
  CheckCircleIcon, 
  UsersIcon, 
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import { AgentWithReputation } from "@/lib/types";

interface ServiceCardProps {
  agent: AgentWithReputation;
  onSelect?: (agent: AgentWithReputation) => void;
  onPurchase?: (agent: AgentWithReputation) => void;
}

export function ServiceCard({ agent, onSelect, onPurchase }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (amount: number) => {
    return `${(amount / 1000).toFixed(2)} USDC`;
  };

  const getReputationColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 4.7) return "text-green-500";
    if (score >= 4.3) return "text-blue-500";
    return "text-yellow-500";
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer hover:scale-[1.02]"
      onClick={() => onSelect?.(agent)}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 bg-linear-to-br from-primary/5 to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative p-6 space-y-4">
        {/* Header: Agent name + Verified badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {agent.agent_name}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {agent.owner?.slice(0, 10)}...
            </p>
          </div>

          {agent.verified && (
            <div className="shrink-0">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 flex items-center gap-1">
                <CheckCircleIcon className="h-3 w-3" />
                <span className="text-xs">Verified</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {agent.description}
        </p>

        {/* Reputation & Stats Row */}
        <div className="flex items-center gap-6 text-sm">
          {/* Reputation Score */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i <= Math.floor(agent.reputation_score ?? 0)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className={`font-semibold ${getReputationColor(agent.reputation_score)}`}>
              {agent.reputation_score?.toFixed(1) ?? "N/A"}
            </span>
          </div>

          {/* Active Users */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <UsersIcon className="h-4 w-4" />
            <span className="text-xs">
              {agent.active_users ? `${(agent.active_users / 1000).toFixed(1)}k` : "0"} users
            </span>
          </div>
        </div>

        {/* Services Delivered Badge */}
        {agent.total_services_delivered && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <SparklesIcon className="h-3 w-3" />
            <span>{agent.total_services_delivered.toLocaleString()} services delivered</span>
          </div>
        )}

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Per credit</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(agent.pricing.amount)}
            </span>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase?.(agent);
            }}
            className="gap-2 group/btn"
            size="sm"
          >
            <span>Access</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>

        {/* Trust Indicator */}
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/5 rounded px-2 py-1">
          <ShieldCheckIcon className="h-3 w-3" />
          <span>Secured by SuiPay</span>
        </div>
      </div>
    </Card>
  );
}

