import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { agentRegistry } from '@/lib/agent-registry';
import { agentExecutor } from '@/lib/agent-executor';

// Agent configuration schema
const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(50, "Agent name is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters").max(2000, "System prompt is too long"),
  model: z.enum(["gpt-4.1-nano", "gpt-4", "gpt-3.5-turbo"]),
  tools: z.array(z.string()).optional(),
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

    // Save agent to registry
    const agentId = agentRegistry.saveAgent({
      name: formData.name,
      description: formData.description,
      systemPrompt: formData.systemPrompt,
      model: formData.model,
      tools: formData.tools || [],
      code: agentCode,
    });

    // Create executable agent instance
    const storedAgent = agentRegistry.getAgent(agentId);
    if (storedAgent) {
      await agentExecutor.createAgentFromStored(storedAgent);
    }

    return NextResponse.json({
      success: true,
      agentId,
      message: `Agent "${formData.name}" created successfully!`
    });

  } catch (error) {
    console.error('Agent creation failed:', error);
    return NextResponse.json(
      { error: 'Agent creation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
