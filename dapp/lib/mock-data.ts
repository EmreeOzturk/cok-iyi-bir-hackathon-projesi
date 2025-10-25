import type { AgentWithReputation, ServiceProfile, AccessNFT, ReputationNFT } from './types';

// Mock agents data
export const MOCK_AGENTS: AgentWithReputation[] = [
  {
    id: "flight-booker-001",
    agent_name: "Flight Booker AI",
    owner: "0x1234567890abcdef",
    description: "Advanced flight booking service with real-time availability and competitive pricing",
    pricing: { model_type: 0, amount: 100 },
    reputation: "0xrep001",
    service_endpoint: "https://api.flight-service.com",
    reputation_score: 4.8,
    verified: true,
    active_users: 1250,
    total_services_delivered: 5420,
  },
  {
    id: "hotel-finder-002",
    agent_name: "Hotel Finder AI",
    owner: "0xabcdef1234567890",
    description: "Premium hotel recommendation engine with personalized filtering and reviews",
    pricing: { model_type: 0, amount: 150 },
    reputation: "0xrep002",
    service_endpoint: "https://api.hotel-service.com",
    reputation_score: 4.6,
    verified: true,
    active_users: 890,
    total_services_delivered: 3210,
  },
  {
    id: "restaurant-guide-003",
    agent_name: "Restaurant Guide AI",
    owner: "0xfedcba0987654321",
    description: "Curated restaurant recommendations based on cuisine, reviews, and user preferences",
    pricing: { model_type: 0, amount: 75 },
    reputation: "0xrep003",
    service_endpoint: "https://api.restaurant-service.com",
    reputation_score: 4.7,
    verified: true,
    active_users: 2100,
    total_services_delivered: 8920,
  },
  {
    id: "data-analyst-004",
    agent_name: "Data Analyst AI",
    owner: "0x9876543210fedcba",
    description: "Real-time data analysis with advanced visualizations and insights",
    pricing: { model_type: 0, amount: 200 },
    reputation: "0xrep004",
    service_endpoint: "https://api.data-analysis.com",
    reputation_score: 4.9,
    verified: true,
    active_users: 560,
    total_services_delivered: 2340,
  },
  {
    id: "content-writer-005",
    agent_name: "Content Writer AI",
    owner: "0x5555555555555555",
    description: "Professional content creation with SEO optimization and style preservation",
    pricing: { model_type: 0, amount: 125 },
    reputation: "0xrep005",
    service_endpoint: "https://api.content-service.com",
    reputation_score: 4.5,
    verified: true,
    active_users: 1800,
    total_services_delivered: 6750,
  },
];

// Mock services data
export const MOCK_SERVICES: ServiceProfile[] = [
  {
    agent_name: "Flight Booker AI",
    owner: "0x123...",
    description: "Flight booking and reservation service",
    pricing: { model_type: 0, amount: 100 },
    reputation: "0x456...",
    service_endpoint: "https://api.flight-service.com",
  },
  {
    agent_name: "Hotel Finder AI",
    owner: "0x789...",
    description: "Hotel reservation and booking service",
    pricing: { model_type: 0, amount: 150 },
    reputation: "0xabc...",
    service_endpoint: "https://api.hotel-service.com",
  },
  {
    agent_name: "Restaurant Guide AI",
    owner: "0xdef...",
    description: "Restaurant recommendations and reservations",
    pricing: { model_type: 0, amount: 75 },
    reputation: "0xfed...",
    service_endpoint: "https://api.restaurant-service.com",
  },
];

// Mock access NFTs data
export const createMockAccessNFTs = (owner: string): AccessNFT[] => [
  {
    id: "0x789...",
    service_id: "flight-service",
    kullanici_id: owner,
    owner,
    credits_remaining: 5,
    tier: 1,
  },
  {
    id: "0xdef...",
    service_id: "hotel-service",
    kullanici_id: owner,
    owner,
    credits_remaining: 8,
    tier: 0,
  },
];

// Mock reputation NFT data
export const createMockReputationNFT = (agentAddress: string): ReputationNFT => ({
  id: "0xabc...",
  agent: agentAddress,
  total_interactions: 10,
  basarili_islem: 8,
  positive: 8,
  negative: 2,
  last_feedback: Date.now(),
});

// Helper function for agent reputation
export const createMockAgentReputation = (agentId: string): ReputationNFT => ({
  id: `rep_${agentId}`,
  agent: agentId,
  total_interactions: 100,
  basarili_islem: 95,
  positive: 95,
  negative: 5,
});
