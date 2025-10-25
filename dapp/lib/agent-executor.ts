// Agent execution engine for running created agents
// Note: This is a simplified implementation for hackathon demo

import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { weatherTool } from "../mastra/tools";
import { StoredAgent } from "./agent-registry";

export class AgentExecutor {
  private agents = new Map<string, Agent>();

  // Create agent instance from stored agent data
  async createAgentFromStored(storedAgent: StoredAgent): Promise<Agent> {
    // Set up memory
    const memory = new Memory({
      storage: new LibSQLStore({
        url: `file:./mastra.db`,
      }),
      options: {
        semanticRecall: false,
        workingMemory: { enabled: false },
        lastMessages: 5
      },
    });

    // Set up tools based on selected tools
    const tools = [];
    if (storedAgent.tools.includes('get_weather')) {
      tools.push(weatherTool);
    }

    // Create agent instance
    const agent = new Agent({
      name: storedAgent.name,
      instructions: storedAgent.systemPrompt,
      model: openai(storedAgent.model),
      memory,
      tools: tools.length > 0 ? tools : undefined,
    });

    // Cache the agent instance
    this.agents.set(storedAgent.id, agent);

    return agent;
  }

  // Execute agent with a prompt
  async executeAgent(agentId: string, prompt: string): Promise<string> {
    const agent = this.agents.get(agentId);

    if (!agent) {
      // Agent not cached, we need to recreate it
      // For now, throw an error - in a real implementation we'd reload from registry
      throw new Error(`Agent ${agentId} not found in cache. Please recreate the agent.`);
    }

    try {
      const result = await agent.generate(prompt);
      return result.text || "No response generated";
    } catch (error) {
      console.error(`Agent execution failed for ${agentId}:`, error);
      throw new Error(`Agent execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Clear cached agents
  clearCache(): void {
    this.agents.clear();
  }

  // Check if agent is cached
  isAgentCached(agentId: string): boolean {
    return this.agents.has(agentId);
  }
}

// Global instance
export const agentExecutor = new AgentExecutor();

