import { create } from "zustand";
import type { ReputationNFT, AgentWithReputation } from "@/lib/types";
import { MOCK_AGENTS, createMockAgentReputation } from "@/lib/mock-data";

interface AgentStoreState {
  // Agent data
  agents: AgentWithReputation[];
  selectedAgent: AgentWithReputation | null;

  // Loading & UI
  isLoading: boolean;
  error: string | null;

  // Reputation data cache
  reputationCache: Record<string, ReputationNFT>;
}

interface AgentStoreActions {
  // Data fetching
  fetchAgents: () => Promise<void>;
  fetchAgentReputation: (agentId: string) => Promise<void>;

  // Selection
  selectAgent: (agent: AgentWithReputation) => void;
  clearSelection: () => void;

  // State management
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

type AgentStore = AgentStoreState & AgentStoreActions;


export const useAgentStore = create<AgentStore>((set, get) => ({
  // Initial state
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,
  reputationCache: {},

  // Data fetching
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual contract call when deployed
      // For now, use mock data
      set({ agents: MOCK_AGENTS, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch agents";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchAgentReputation: async (agentId: string) => {
    try {
      // TODO: Replace with actual contract call
      // For now, mock reputation data
      const mockReputation = createMockAgentReputation(agentId);

      set((state) => ({
        reputationCache: {
          ...state.reputationCache,
          [agentId]: mockReputation,
        },
      }));
    } catch (error) {
      console.error(`Failed to fetch reputation for ${agentId}:`, error);
    }
  },

  // Selection
  selectAgent: (agent: AgentWithReputation) => {
    set({ selectedAgent: agent });
  },

  clearSelection: () => {
    set({ selectedAgent: null });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
