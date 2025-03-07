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
   pnpm install
   ```

3. **Build the project**:

   ```bash
   pnpm run build
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
   pnpm run inspect
   ```

2. **Watch mode** (automatically restarts when code changes):

   ```bash
   pnpm run inspect-watch
   ```

3. **Access the GUI** by opening [http://localhost:8080/?proxyPort=9000](http://localhost:8080/?proxyPort=9000) in your browser.

### Inspector Features

- **List Tools**: View all available tools and their specifications
- **Test Tools**: Try out tools by filling out a form with input parameters
- **Inspect Requests/Responses**: See the exact JSON requests and responses
- **Real-time Testing**: Immediate feedback for tool execution

## Integrating with Cursor

### Running locally with Cursor

1. MAKE A NEW CONTENTFUL ENVRIONMENT FIRST!!
2. Make sure you have a .env file with the `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`, `SPACE_ID` and `ENVIRONMENT_ID` set.
3. Run the build using `pnpm build`
4. Open up Cursor > Settings > MCP
5. Add a new MCP server
6. Give it a name `contentful-api` and choose `command` as the option
7. Add the full path to the `run-mcp.sh` file (e.g. `/Users/bradtaylor/Github/contentful-mcp/run-mcp.sh`)
8. Then Ask Cursor Agent to do tasks for you in Contentful, sitback and watch the magic

### Project-specific Configuration

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

## Development

- **Build**: `pnpm run build` - Compiles TypeScript and bundles server code
- **Development**: `pnpm run dev` - Watches for changes and rebuilds automatically
- **Inspect**: `pnpm run inspect` - Will start the process and allows you to debug in the GUI
- **Testing**: `pnpm test` - Runs tests using Vitest
- **Type checking**: `pnpm run typecheck` - Verifies TypeScript types

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
