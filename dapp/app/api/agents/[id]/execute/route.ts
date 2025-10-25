import { NextRequest, NextResponse } from 'next/server';
import { agentExecutor } from '@/lib/agent-executor';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    const { id: agentId } = await params;

    // Execute the agent
    const result = await agentExecutor.executeAgent(agentId, prompt);

    return NextResponse.json({
      success: true,
      result,
      agentId
    });

  } catch (error) {
    console.error('Agent execution failed:', error);

    // Check if it's a specific error about agent not found
    if (error instanceof Error && error.message.includes('not found in cache')) {
      return NextResponse.json(
        { error: 'Agent not found or not cached. Please recreate the agent.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Agent execution failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
