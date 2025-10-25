// In-memory agent registry for hackathon demo
// In production, this would be a database

export interface StoredAgent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  tools: string[];
  code: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}

class AgentRegistry {
  private agents = new Map<string, StoredAgent>();

  // Save agent to registry
  saveAgent(agentData: Omit<StoredAgent, 'id' | 'createdAt' | 'status'>): string {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agent: StoredAgent = {
      id,
      ...agentData,
      createdAt: new Date(),
      status: 'active',
    };

    this.agents.set(id, agent);
    console.log(`Agent saved: ${id}`, agent);
    return id;
  }

  // Get agent by ID
  getAgent(id: string): StoredAgent | undefined {
    return this.agents.get(id);
  }

  // Get all agents
  getAllAgents(): StoredAgent[] {
    return Array.from(this.agents.values());
  }

  // Delete agent
  deleteAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  // Update agent status
  updateAgentStatus(id: string, status: 'active' | 'inactive'): boolean {
    const agent = this.agents.get(id);
    if (agent) {
      agent.status = status;
      return true;
    }
    return false;
  }
}

// Global instance
export const agentRegistry = new AgentRegistry();

