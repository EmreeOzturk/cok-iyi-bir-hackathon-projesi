// Common types for contract interactions
export type ServiceProfile = {
  agent_name?: string;
  owner: string;
  description: string;
  pricing: {
    model_type: number;
    amount: number;
  };
  reputation: string;
  service_endpoint: string;
};

export type AccessNFT = {
  id: string;
  service_id: string;
  kullanici_id: string;
  owner: string;
  credits_remaining: number;
  expiry?: number;
  tier: number;
};

export type ReputationNFT = {
  id: string;
  agent: string;
  total_interactions: number;
  basarili_islem: number;
  positive: number;
  negative: number;
  last_feedback?: number;
};

// Agent store types
export type AgentCategory = "flight" | "hotel" | "restaurant" | "data-analysis" | "research" | "content-writing" | "all";

export type SortBy = "reputation" | "price-low" | "price-high" | "newest";

export interface AgentWithReputation extends ServiceProfile {
  id: string;
  reputation_score?: number;
  verified?: boolean;
  active_users?: number;
  total_services_delivered?: number;
}

// Transaction executor types
export interface TransactionResult {
  digest: string;
  effects?: unknown;
  events?: unknown;
  balanceChanges?: unknown;
}
