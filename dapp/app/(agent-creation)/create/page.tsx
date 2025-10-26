"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot, Sparkles, Code, Wallet } from "lucide-react";
import { z } from "zod";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useContractTransactions } from "@/stores/use-contract-transactions";
import { useRouter } from "next/navigation";

// Agent configuration schema
const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(50, "Agent name is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters").max(2000, "System prompt is too long"),
  model: z.enum(["gpt-4.1-nano", "gpt-4", "gpt-3.5-turbo"]),
  tools: z.array(z.string()).optional(), // Array of tool IDs
  pricingModel: z.object({
    model_type: z.number().min(0).max(2),
    amount: z.number().min(0),
  }).optional(),
});

type AgentFormData = z.infer<typeof agentSchema>;

// Available tools for selection
const availableTools: Record<string, { name: string; description: string }> = {
  get_weather: {
    name: "Weather Tool",
    description: "Get current weather information for any location"
  },
};

export default function AgentCreationPage() {
  const account = useCurrentAccount();
  const { registerAgentWithNFT } = useContractTransactions(null);
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isRegisteringOnChain, setIsRegisteringOnChain] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    description: "",
    systemPrompt: "",
    model: "gpt-4.1-nano",
    tools: [],
    pricingModel: {
      model_type: 0, // per_credit
      amount: 1000000, // 1 SUI in MIST
    },
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AgentFormData, string>>>({});

  const handleInputChange = (field: keyof AgentFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'model' ? value as AgentFormData['model'] :
              field === 'tools' ? value as string[] : value as string
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      agentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof AgentFormData, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof AgentFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleCreateAgent = async () => {
    if (!validateForm()) return;

    if (!account) {
      alert("Please connect your wallet first to create an agent with on-chain registration.");
      return;
    }

    setIsCreating(true);
    try {
      // First create the agent locally via API
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          systemPrompt: formData.systemPrompt,
          model: formData.model,
          tools: formData.tools || [],
          signerAddress: account.address,
          pricingModel: formData.pricingModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create agent');
      }

      const localAgentId = data.agentId;
      console.log("Agent created locally with ID:", localAgentId);

      // Now register on-chain
      setIsRegisteringOnChain(true);
      try {
        const onChainAgentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log("🎯 Starting on-chain registration...");
        console.log("📋 Form data:", formData);
        console.log("👤 Account address:", account.address);
        console.log("🆔 Local agent ID:", localAgentId);
        console.log("🔗 On-chain agent ID:", onChainAgentId);
        console.log("💰 Pricing model:", formData.pricingModel || { model_type: 0, amount: 1000000 });
        console.log("🌐 Service endpoint:", `${window.location.origin}/api/agents/${localAgentId}/execute`);

        const registrationResult = await registerAgentWithNFT(
          onChainAgentId,
          formData.name,
          formData.description,
          formData.pricingModel || { model_type: 0, amount: 1000000 },
          `${window.location.origin}/api/agents/${localAgentId}/execute`,
          account.address
        );

        console.log("Agent registered on-chain:", registrationResult);

        alert(`Agent "${formData.name}" created and registered on-chain successfully!\nLocal Agent ID: ${localAgentId}\nOn-chain Agent ID: ${onChainAgentId}\nReputationNFT ID: ${registrationResult.reputationNftId}\n\nYou can now chat with your agent.`);

      } catch (onChainError) {
        console.error("On-chain registration failed:", onChainError);
        alert(`Agent created locally but on-chain registration failed: ${onChainError instanceof Error ? onChainError.message : 'Unknown error'}\n\nYou can still chat with your agent locally.`);
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        systemPrompt: "",
        model: "gpt-4.1-nano",
        tools: [],
        pricingModel: {
          model_type: 0,
          amount: 1000000,
        },
      });

      // Redirect to agents page
      router.push("/agents");

    } catch (error) {
      console.error("Agent creation failed:", error);
      alert(`Agent creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
      setIsRegisteringOnChain(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create AI Agent</h1>
              <p className="text-gray-600 mt-1">Create your own AI agent and register it on-chain</p>
            </div>
          </div>

          {/* Wallet Status */}
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            {account ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Wallet Not Connected
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Agent Configuration
              </CardTitle>
              <CardDescription>
                Define your agent&apos;s core characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  placeholder="e.g: Weather Assistant"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your agent does..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4.1-nano">GPT-4.1 Nano (Fast & Efficient)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4 (Most Powerful)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Define your agent&apos;s behavior and personality..."
                  value={formData.systemPrompt}
                  onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
                  className={errors.systemPrompt ? "border-red-500" : ""}
                  rows={6}
                />
                {errors.systemPrompt && <p className="text-sm text-red-500">{errors.systemPrompt}</p>}
                <p className="text-sm text-gray-500">
                  Describe how your agent should behave and what tasks it should perform.
                </p>
              </div>

              {/* Tool Selection */}
              <div className="space-y-2">
                <Label>Available Tools (Optional)</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select tools your agent can use to perform actions
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(availableTools).map(([toolId, tool]) => (
                    <div key={toolId} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={toolId}
                        checked={formData.tools?.includes(toolId) || false}
                        onChange={(e) => {
                          const toolId = e.target.id;
                          setFormData(prev => ({
                            ...prev,
                            tools: e.target.checked
                              ? [...(prev.tools || []), toolId]
                              : (prev.tools || []).filter(id => id !== toolId)
                          }));
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={toolId} className="text-sm font-normal">
                        <strong>{tool.name}:</strong> {tool.description}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.tools && formData.tools.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected tools:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tools.map(toolId => (
                        <Badge key={toolId} variant="outline">
                          {availableTools[toolId]?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <Button
                onClick={handleCreateAgent}
                disabled={isCreating || isRegisteringOnChain || !account}
                className="w-full"
                size="lg"
              >
                {isRegisteringOnChain ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering on Sui Blockchain...
                  </>
                ) : isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Agent...
                  </>
                ) : !account ? (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet to Create Agent
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Create Agent & Register on Sui
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Dynamic Creation</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Mastra AI</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Sui Blockchain Registration</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">ReputationNFT Minting</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Pay-per-Use Monetization</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-4 h-4" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• Connect your Sui wallet to register agents on-chain.</p>
              <p>• ReputationNFT tracks your agent&apos;s performance and reputation.</p>
              <p>• Set competitive pricing to attract more users.</p>
              <p>• The more detailed your system prompt, the better your agent performs.</p>
              <p>• Start with GPT-4.1 Nano for fast testing, then upgrade to GPT-4 for production.</p>
            </CardContent>
          </Card>

          {/* Model Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model Comparison</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">GPT-4.1 Nano</div>
                <div className="text-gray-600">Fast & efficient</div>
                <div className="font-medium">GPT-4</div>
                <div className="text-gray-600">Most intelligent</div>
                <div className="font-medium">GPT-3.5 Turbo</div>
                <div className="text-gray-600">Fast & affordable</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

