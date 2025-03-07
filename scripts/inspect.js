#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";

// Define console for linter
const { console } = globalThis;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = resolve(__dirname, "../bin/mcp-server.js");

// Set environment variables for ports
process.env.CLIENT_PORT = process.env.CLIENT_PORT || "8080";
process.env.SERVER_PORT = process.env.SERVER_PORT || "9000";

// Add debug flag to help diagnose tool registration issues
process.env.DEBUG = "mcp:*";

const args = ["npx", "@modelcontextprotocol/inspector", "node", serverPath];

// Add environment variables as CLI arguments if they exist
if (process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) {
  args.push(`--headers=${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}`);
}

// Execute the command
const inspect = spawn(args[0], args.slice(1), {
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
