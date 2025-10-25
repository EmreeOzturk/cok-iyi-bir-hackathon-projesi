import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Weather tool using proper Mastra tool definition
export const weatherTool = createTool({
  id: "get_weather",
  description: "Get current weather information for a location",
  inputSchema: z.object({
    location: z.string().describe("The city name to get weather for"),
  }),
  outputSchema: z.object({
    location: z.string(),
    temperature: z.number(),
    condition: z.string(),
    humidity: z.number(),
    windSpeed: z.number(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      // For demo purposes, return mock data
      // In production, this would call a real weather API like OpenWeatherMap
      const mockWeatherData = {
        location: context.location,
        temperature: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
        condition: ["Sunny", "Cloudy", "Rainy", "Snowy"][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 20),
      };

      return {
        location: mockWeatherData.location,
        temperature: mockWeatherData.temperature,
        condition: mockWeatherData.condition,
        humidity: mockWeatherData.humidity,
        windSpeed: mockWeatherData.windSpeed,
        message: `Current weather in ${mockWeatherData.location}: ${mockWeatherData.temperature}°C, ${mockWeatherData.condition}`,
      };
    } catch (error) {
      throw new Error(`Failed to get weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Tool registry for dynamic agent creation
export const toolRegistry = {
  get_weather: {
    name: "get_weather",
    description: "Get current weather for a location",
    tool: weatherTool,
    parameters: {
      location: {
        type: "string",
        description: "The city name to get weather for",
        required: true,
      },
    },
  },
};
