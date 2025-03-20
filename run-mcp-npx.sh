#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run the MCP server with environment variables as command-line arguments
npx @last-rev/contentful-mcp-server \
  --management-token "$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN" \
  --space-id "$SPACE_ID" \
  --environment-id "$ENVIRONMENT_ID"

# Note: You can add more arguments as needed
# --host <host>
# --private-key <key>
# --app-id <id> 