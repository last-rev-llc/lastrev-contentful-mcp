#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";

// Define console for linter
const { console } = globalThis;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the path to our MCP server script
const serverPath = resolve(__dirname, "../bin/mcp-server.js");

// Use default MCP Inspector ports (6274 for client, 6277 for proxy)
// Only set these if you need custom ports
// process.env.CLIENT_PORT = process.env.CLIENT_PORT || "6274";
// process.env.SERVER_PORT = process.env.SERVER_PORT || "6277";

// List of environment variables to pass to the MCP server
const envVarsToPass = [
  "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN",
  "SPACE_ID",
  "ENVIRONMENT_ID",
  "CONTENTFUL_HOST",
  "PRIVATE_KEY",
  "APP_ID"
];

// Build the command array with environment variables
const cmdArgs = [];

// Add environment variables as -e flags
for (const varName of envVarsToPass) {
  if (process.env[varName]) {
    cmdArgs.push("-e", `${varName}=${process.env[varName]}`);
  }
}

// Add the server command and path
cmdArgs.push("node", serverPath);

// Create the spawn command for npx @modelcontextprotocol/inspector
const inspect = spawn("npx", ["@modelcontextprotocol/inspector", ...cmdArgs], {
  stdio: "inherit",
  env: process.env
});

inspect.on("error", (err) => {
  console.error("Failed to start inspector:", err);
  process.exit(1);
});

inspect.on("exit", (code) => {
  process.exit(code || 0);
});
