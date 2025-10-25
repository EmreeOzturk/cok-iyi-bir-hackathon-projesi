"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot, Sparkles, Code } from "lucide-react";
import { z } from "zod";

// Agent configuration schema
const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(50, "Agent name is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters").max(2000, "System prompt is too long"),
  model: z.enum(["gpt-4.1-nano", "gpt-4", "gpt-3.5-turbo"]),
  tools: z.array(z.string()).optional(), // Array of tool IDs
});

type AgentFormData = z.infer<typeof agentSchema>;

// Available tools for selection
const availableTools: Record<string, { name: string; description: string }> = {
  get_weather: {
    name: "Weather Tool",
    description: "Get current weather information for any location"
  },
  // Add more tools here as they become available
};

export default function AgentCreationPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    description: "",
    systemPrompt: "",
    model: "gpt-4.1-nano",
    tools: [],
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

    setIsCreating(true);
    try {
      // Create agent via API
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create agent');
      }

      const agentId = data.agentId;

      console.log("Agent created with ID:", agentId);

      // Show success message with agent ID
      alert(`Agent "${formData.name}" created successfully!\nAgent ID: ${agentId}\n\nYou can now chat with your agent.`);

      // Reset form
      setFormData({
        name: "",
        description: "",
        systemPrompt: "",
        model: "gpt-4.1-nano",
        tools: [],
      });

    } catch (error) {
      console.error("Agent creation failed:", error);
      alert(`Agent creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create AI Agent</h1>
            <p className="text-gray-600 mt-1">Create your own AI agent and monetize it</p>
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
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Create Agent
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
                <Badge variant="outline">Blockchain Registered</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Pay-per-Use</Badge>
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
              <p>• The more detailed your system prompt, the better your agent performs.</p>
              <p>• Highlight what makes your agent unique.</p>
              <p>• Write clear and user-friendly descriptions.</p>
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

