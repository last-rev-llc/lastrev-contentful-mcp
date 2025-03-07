# Contentful MCP Server

A Model Context Protocol (MCP) server implementation that integrates with Contentful's Content Management API. This server allows AI assistants like Claude in Cursor to manage your Contentful content through natural language.

## What is this?

This MCP server acts as a bridge between AI tools and Contentful's Content Management API (CMA). It translates AI requests into API calls, enabling AI assistants to:

- Create, read, update, and delete content entries and assets
- Manage content types and their fields
- Control publishing workflows
- Administer spaces and environments

## Features

- **Comprehensive Content Management**: Full CRUD operations for entries and assets
- **Content Type Management**: Create and modify content models
- **Space Administration**: Manage spaces and environments
- **Publishing Control**: Publish and unpublish content as needed
- **Smart Pagination**: List operations return limited items per page to prevent context window overflows in AI tools
- **Flexible Configuration**: Support for environment variables and command-line arguments
- **Robust Error Handling**: Comprehensive error handling for API interactions

## Quick Start: Running Locally

1. **Clone this repository and navigate to the directory**:

   ```bash
   git clone https://github.com/last-rev-llc/lastrev-contentful-mcp.git
   cd contentful-mcp
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **Set up your environment variables**:
   Create a `.env` file in the project root with:

   ```
   CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=your_contentful_management_token
   # Optional: Scope to specific space and environment
   SPACE_ID=your_space_id
   ENVIRONMENT_ID=your_environment_id
   ```

5. **Start the server in one of these ways**:

   **Using the provided script**:

   ```bash
   ./run-mcp.sh
   ```

   **Or directly with Node**:

   ```bash
   node bin/mcp-server.js
   ```

   **Or with additional arguments**:

   ```bash
   node bin/mcp-server.js --management-token your_token --space-id your_space_id
   ```

## Using the GUI Debugger (MCP Inspector)

The MCP Inspector provides a visual interface for testing and debugging your MCP tools. This is extremely helpful during development.

### Starting the Inspector

1. **Basic mode**:

   ```bash
   npm run inspect
   ```

2. **Watch mode** (automatically restarts when code changes):

   ```bash
   npm run inspect-watch
   ```

3. **Access the GUI** by opening [http://localhost:5173](http://localhost:5173) in your browser.

### Inspector Features

- **List Tools**: View all available tools and their specifications
- **Test Tools**: Try out tools by filling out a form with input parameters
- **Inspect Requests/Responses**: See the exact JSON requests and responses
- **Real-time Testing**: Immediate feedback for tool execution

## Integrating with Cursor

### Project-specific Configuration (Recommended)

1. Create `.cursor/mcp.json` in your project root:

   ```json
   {
     "mcpServers": {
       "contentful": {
         "command": "./run-mcp.sh",
         "args": []
       }
     }
   }
   ```

2. Restart Cursor.

### Global Configuration

1. Create or edit the MCP config file in Cursor's configuration directory:
   - macOS: `~/Library/Application Support/Cursor/mcp_config.json`
   - Windows: `%APPDATA%\Cursor\mcp_config.json`
   - Linux: `~/.config/Cursor/mcp_config.json`

2. Add the configuration:

   ```json
   {
     "mcpServers": {
       "contentful": {
         "command": "node",
         "args": ["/absolute/path/to/contentful-mcp/bin/mcp-server.js"]
       }
     }
   }
   ```

3. Restart Cursor.

## Development

- **Build**: `npm run build` - Compiles TypeScript and bundles server code
- **Development**: `npm run dev` - Watches for changes and rebuilds automatically
- **Testing**: `npm test` - Runs tests using Vitest
- **Type checking**: `npm run typecheck` - Verifies TypeScript types

## Available Tools

### Entry Management

- **search_entries**: Search for entries using query parameters
- **create_entry**: Create new entries
- **get_entry**: Retrieve entries by ID
- **update_entry**: Update entry fields
- **delete_entry**: Remove entries
- **publish_entry**: Publish entries
- **unpublish_entry**: Unpublish entries

### Asset Management

- **list_assets**: List assets with pagination
- **upload_asset**: Upload new assets with metadata
- **get_asset**: Retrieve asset details
- **update_asset**: Update asset metadata and files
- **delete_asset**: Remove assets
- **publish_asset**: Publish assets
- **unpublish_asset**: Unpublish assets

### Content Type Management

- **list_content_types**: List content types
- **get_content_type**: Get content type details
- **get_editor_interface**: Get editor interface configuration
- **update_editor_interface**: Update editor interface
- **create_content_type**: Create new content types
- **update_content_type**: Update content types
- **delete_content_type**: Remove content types
- **publish_content_type**: Publish content types

### Space & Environment Management

- **list_spaces**: List available spaces
- **get_space**: Get space details
- **list_environments**: List environments in a space
- **create_environment**: Create new environments
- **delete_environment**: Remove environments

## Advanced Configuration

### Authentication Options

1. **Content Management API Token** (standard):
   Set `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` or use `--management-token`

2. **App Identity** (for production systems):
   Requires:
   - `--app-id`: Your Contentful App ID
   - `--private-key`: Private key created for your app
   - `--space-id`: Space where the app is installed
   - `--environment-id`: Environment where the app is installed

### Space and Environment Scoping

You can limit operations to a specific space and environment by setting:

- `SPACE_ID` / `--space-id`: Limits to a specific Contentful space
- `ENVIRONMENT_ID` / `--environment-id`: Limits to a specific environment

When both are set, tools won't require space/environment parameters from the user.

## Error Handling

The server implements robust error handling for:

- Authentication failures
- Rate limiting
- Invalid requests
- Network issues
- API-specific errors

## License

MIT License

## Caution

This MCP Server gives AI tools the ability to create, update, and delete content in your Contentful spaces. Always ensure you understand what permissions you're granting and review any changes suggested by AI tools.
