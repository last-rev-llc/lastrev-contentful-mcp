#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run the MCP inspector with environment variables passed using the -e flag
npx @modelcontextprotocol/inspector \
  -e CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
  -e SPACE_ID=$SPACE_ID \
  -e ENVIRONMENT_ID=$ENVIRONMENT_ID \
  node ./bin/mcp-server.js

# You can add more environment variables as needed with additional -e flags 