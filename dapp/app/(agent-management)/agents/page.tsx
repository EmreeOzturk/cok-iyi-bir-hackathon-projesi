"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, Trash2, Loader2, Database, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useAgentStore } from "@/stores/use-agent-store";
import { CONTRACT_CONFIG } from "@/lib/config";

interface StoredAgent {
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

export default function AgentsPage() {
    const [localAgents, setLocalAgents] = useState<StoredAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const { agents: onChainAgents, fetchAgents: fetchOnChainAgents, isLoading: onChainLoading } = useAgentStore(CONTRACT_CONFIG.REGISTRY_ID);

    // Fetch local agents from API
    const fetchLocalAgents = useCallback(async () => {
        try {
            const response = await fetch('/api/agents');
            const data = await response.json();

            if (response.ok && data.success) {
                // Convert createdAt strings back to Date objects
                const agentsWithDates = data.agents.map((agent: StoredAgent & { createdAt: string }) => ({
                    ...agent,
                    createdAt: new Date(agent.createdAt)
                }));
                setLocalAgents(agentsWithDates);
            } else {
                console.error('Failed to fetch local agents:', data.error);
            }
        } catch (error) {
            console.error('Error fetching local agents:', error);
        }
    }, []);

    // Fetch all agents (both local and on-chain)
    const fetchAllAgents = useCallback(async () => {
        await Promise.all([
            fetchLocalAgents(),
            fetchOnChainAgents()
        ]);
    }, [fetchLocalAgents, fetchOnChainAgents]);

    useEffect(() => {
        let mounted = true;

        const loadAgents = async () => {
            if (mounted) {
                setLoading(true);
                try {
                    await fetchAllAgents();
                } finally {
                    if (mounted) {
                        setLoading(false);
                    }
                }
            }
        };

        loadAgents();

        return () => {
            mounted = false;
        };
    }, [fetchAllAgents]);

    const handleDeleteAgent = useCallback(async (agentId: string) => {
        if (confirm("Are you sure you want to delete this agent?")) {
            try {
                const response = await fetch(`/api/agents/${agentId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Refresh the agents list
                    fetchAllAgents();
                } else {
                    const data = await response.json();
                    alert(`Failed to delete agent: ${data.error}`);
                }
            } catch (error) {
                console.error('Error deleting agent:', error);
                alert('Failed to delete agent');
            }
        }
    }, [fetchAllAgents]);

    if (loading || onChainLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading agents...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Agents</h1>
                        <p className="text-gray-600 mt-1">Manage your created agents</p>
                    </div>
                    <Link href="/agent-creation/create">
                        <Button>
                            <Bot className="w-4 h-4 mr-2" />
                            Create New Agent
                        </Button>
                    </Link>
                </div>
            </div>

            {/* On-chain Agents Section */}
            {onChainAgents.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">On-Chain Registered Agents</h2>
                        <Badge variant="outline" className="text-blue-600">{onChainAgents.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {onChainAgents.map((agent) => (
                            <Card key={agent.id} className="hover:shadow-lg transition-shadow border-blue-200">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Bot className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
                                                <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                                                    On-Chain Verified
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mb-4">
                                        {agent.description}
                                    </CardDescription>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Pricing:</span>
                                            <Badge variant="outline">
                                                {agent.pricing.model_type === 0 ? 'Per Credit' :
                                                 agent.pricing.model_type === 1 ? 'Subscription' : 'Free'} - {agent.pricing.amount} MIST
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Reputation:</span>
                                            <Badge variant={agent.verified ? "success" : "outline"}>
                                                {(agent.reputation_score || 0).toFixed(1)}/100 {agent.verified && "✓"}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Interactions:</span>
                                            <span className="text-gray-500">{agent.active_users}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <div className="text-sm text-gray-600 mb-2">
                                            Service Endpoint: {agent.service_endpoint.slice(0, 30)}...
                                        </div>
                                        <Button className="w-full" variant="outline">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Interact
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Local Agents Section */}
            {localAgents.length === 0 && onChainAgents.length === 0 ? (
                <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                    <p className="text-gray-600 mb-4">Create your first AI agent and register it on the Sui blockchain</p>
                    <Link href="/agent-creation/create">
                        <Button>
                            <Bot className="w-4 h-4 mr-2" />
                            Create Your First Agent
                        </Button>
                    </Link>
                </div>
            ) : localAgents.length > 0 ? (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Database className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Local Agents</h2>
                        <Badge variant="outline" className="text-gray-600">{localAgents.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {localAgents.map((agent) => (
                        <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Bot className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                                            <Badge variant={agent.status === 'active' ? 'success' : 'outline'} className="mt-1">
                                                {agent.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteAgent(agent.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">
                                    {agent.description}
                                </CardDescription>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Model:</span>
                                        <Badge variant="outline">{agent.model}</Badge>
                                    </div>

                                    {agent.tools.length > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Tools:</span>
                                            <div className="flex gap-1">
                                                {agent.tools.map(tool => (
                                                    <Badge key={tool} variant="subtle" className="text-xs">
                                                        {tool}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Created:</span>
                                        <span className="text-gray-500">
                                            {agent.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <Link href={`/chat/${agent.id}`}>
                                        <Button className="w-full">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Sohbet Et
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
