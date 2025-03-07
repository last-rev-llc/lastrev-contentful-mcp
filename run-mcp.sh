#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Load environment variables from .env file in the script directory
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v "^#" "$SCRIPT_DIR/.env" | xargs)
fi

# Run the MCP server using absolute path
node "$SCRIPT_DIR/bin/mcp-server.js"
