import { NextResponse } from 'next/server';
import { agentRegistry } from '@/lib/agent-registry';

export async function GET() {
  try {
    const agents = agentRegistry.getAllAgents();

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error('Failed to get agents:', error);
    return NextResponse.json(
      { error: 'Failed to get agents', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
