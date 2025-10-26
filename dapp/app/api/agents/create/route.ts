import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { agentRegistry } from '@/lib/agent-registry';
import { agentExecutor } from '@/lib/agent-executor';
import { SuiClient } from '@mysten/sui/client';
import { AgentCommerceContract } from '@/lib/contracts';
import { CONTRACT_CONFIG } from '@/lib/config';

// Agent configuration schema
const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(50, "Agent name is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters").max(2000, "System prompt is too long"),
  model: z.enum(["gpt-4.1-nano", "gpt-4", "gpt-3.5-turbo"]),
  tools: z.array(z.string()).optional(),
  signerAddress: z.string().min(1, "Signer address is required"),
  pricingModel: z.object({
    model_type: z.number().min(0).max(2), // 0: per_credit, 1: subscription, 2: free
    amount: z.number().min(0),
  }).optional(),
});

// Helper function to generate Mastra agent code
function generateMastraAgent(config: z.infer<typeof agentSchema>): string {
  const agentName = config.name.replace(/\s+/g, '').toLowerCase();

  // Generate tool imports and usage
  const toolImports = config.tools && config.tools.length > 0
    ? config.tools.map(toolId => {
        const toolName = toolId === 'get_weather' ? 'weatherTool' : `${toolId}Tool`;
        return `import { ${toolName} } from "../tools";`;
      }).join('\n')
    : '';

  const toolArray = config.tools && config.tools.length > 0
    ? config.tools.map(toolId => toolId === 'get_weather' ? 'weatherTool' : `${toolId}Tool`).join(', ')
    : '';

  return `
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
${toolImports}

const memory = new Memory({
  storage: new LibSQLStore({
    url: \`file:./mastra.db\`,
  }),
  options: {
    semanticRecall: false,
    workingMemory: { enabled: false },
    lastMessages: 5
  },
});

export const ${agentName}Agent = new Agent({
  name: "${config.name}",
  instructions: \`${config.systemPrompt}\`,
  model: openai("${config.model}"),
  memory,
  ${config.tools && config.tools.length > 0 ? `tools: [${toolArray}],` : ''}
});

// REST API endpoint for this agent
export async function handleAgentRequest(request: any) {
  try {
    const result = await ${agentName}Agent.generate(request.prompt || request.message);
    return {
      success: true,
      result: result.text,
      agent: "${config.name}",
      model: "${config.model}"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Agent execution failed"
    };
  }
}
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = agentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Generate Mastra agent code
    const agentCode = generateMastraAgent(formData);

    // Generate unique agent ID
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set default pricing if not provided
    const pricing = formData.pricingModel || {
      model_type: 0, // per_credit by default
      amount: 1000000, // 1 SUI in MIST
    };

    // Initialize Sui client
    const client = new SuiClient({
      url: `https://${CONTRACT_CONFIG.NETWORK}.sui.io`,
    });

    const contract = new AgentCommerceContract(client);

    try {
      // Check if registry exists, create if not
      let registryId = CONTRACT_CONFIG.REGISTRY_ID;
      if (registryId === '0x0') {
        console.log("Creating agent registry...");
        // For API-based creation, we can't execute transactions directly
        // This would need to be handled by the frontend
        throw new Error("Registry not initialized. Please create registry first through the frontend.");
      }

      // Mint ReputationNFT (this would be done by frontend transaction)
      console.log("Note: ReputationNFT minting should be done via frontend transaction");

      // For now, save agent to local registry
      const localAgentId = agentRegistry.saveAgent({
        name: formData.name,
        description: formData.description,
        systemPrompt: formData.systemPrompt,
        model: formData.model,
        tools: formData.tools || [],
        code: agentCode,
      });

      // Create executable agent instance
      const storedAgent = agentRegistry.getAgent(localAgentId);
      if (storedAgent) {
        await agentExecutor.createAgentFromStored(storedAgent);
      }

      return NextResponse.json({
        success: true,
        agentId: localAgentId,
        onChainAgentId: agentId,
        signerAddress: formData.signerAddress,
        pricing,
        message: `Agent "${formData.name}" created successfully! Note: On-chain registration requires frontend transaction.`,
        requiresOnChainRegistration: true,
      });

    } catch (error) {
      console.error('On-chain registration failed:', error);

      // Fallback: create agent locally without on-chain registration
      console.log("Falling back to local agent creation...");

      const localAgentId = agentRegistry.saveAgent({
        name: formData.name,
        description: formData.description,
        systemPrompt: formData.systemPrompt,
        model: formData.model,
        tools: formData.tools || [],
        code: agentCode,
      });

      // Create executable agent instance
      const storedAgent = agentRegistry.getAgent(localAgentId);
      if (storedAgent) {
        await agentExecutor.createAgentFromStored(storedAgent);
      }

      return NextResponse.json({
        success: true,
        agentId: localAgentId,
        message: `Agent "${formData.name}" created locally! On-chain registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        onChainRegistrationFailed: true,
      });
    }

  } catch (error) {
    console.error('Agent creation failed:', error);
    return NextResponse.json(
      { error: 'Agent creation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
