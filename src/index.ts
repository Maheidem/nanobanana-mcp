#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initGeminiClient } from "./services/gemini.js";
import { registerGenerateTool } from "./tools/generate.js";
import { registerEditTool } from "./tools/edit.js";
import { registerSessionTools } from "./tools/session.js";
import { loadConfig, isFirstRun } from "./utils/config.js";
import type { SessionState } from "./types.js";

// Load persisted config
const config = loadConfig();
const firstRun = isFirstRun();

const state: SessionState = {
  lastImagePath: null,
  lastPrompt: null,
  lastModel: null,
  lastTimestamp: null,
  preferredModel: config.preferredModel,
  needsModelSelection: firstRun || !config.preferredModel,
};

async function main(): Promise<void> {
  // Fail-fast: validate API key is present
  initGeminiClient();

  const server = new McpServer({
    name: "nanobanana-mcp",
    version: "1.0.0",
  });

  // Register all 5 tools
  registerGenerateTool(server, state);
  registerEditTool(server, state);
  registerSessionTools(server, state);

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
