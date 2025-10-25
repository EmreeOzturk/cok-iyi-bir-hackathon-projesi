import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { weatherTool } from "../tools";

const memory = new Memory({
  storage: new LibSQLStore({
    url: `file:./mastra.db`,
  }),
  options: {
    semanticRecall: false,
    workingMemory: {
      enabled: false,
    },
    lastMessages: 5
  },
});

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
You are a helpful weather assistant that provides accurate weather information.
Use the weather tool to get current weather data for locations.
Always provide temperature in Celsius and give helpful context about the weather conditions.
When users ask about weather, use the get_weather tool to fetch current data.
  `,
  model: openai("gpt-4.1-nano"),
  memory,
  tools: [weatherTool],
});
