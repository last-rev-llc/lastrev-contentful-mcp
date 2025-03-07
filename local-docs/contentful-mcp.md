# Contentful MCP Server Documentation

## Overview

Contentful MCP Server is an implementation of the Model Context Protocol (MCP) server.
It integrates with the Contentful Content Management API.
This server allows AI tools like Cursor to interact with and manage your Contentful content.
It provides features for content, space, and content type management.

## Quick Start

This guide helps you quickly set up and use the Contentful MCP Server with Cursor.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/last-rev-llc/lastrev-contentful-mcp.git
    cd contentful-mcp
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Build the project:**

    ```bash
    npm run build
    ```

4. **Configure environment variables:**
    Create a `.env` file in the project root and add your Contentful Management API token and Space ID (optional).

    ```
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=your_contentful_management_token
    SPACE_ID=your_space_id # Optional
    ENVIRONMENT_ID=your_environment_id # Optional, defaults to 'master'
    ```

5. **Create `run-mcp.sh`:**
    Create a script to easily run the server with your environment variables:

    ```bash
    cat > run-mcp.sh << 'EOF'
    #!/bin/bash

    # Load environment variables from .env file
    export $(grep -v '^#' .env | xargs)

    # Run the MCP server
    node ./bin/mcp-server.js
    EOF

    chmod +x run-mcp.sh
    ```

6. **Configure Cursor:**
    Create `.cursor/mcp.json` in your project root to connect Cursor to your local MCP server.

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

7. **Restart Cursor.** The Contentful tools are now available in Cursor when you chat with Claude.

## Configuration

The Contentful MCP Server can be configured using environment variables or command-line arguments.

### Environment Variables

* `CONTENTFUL_HOST`: Contentful Management API endpoint. Defaults to `https://api.contentful.com`.
* `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`: Contentful Management API access token. Required unless using App Identity.
* `SPACE_ID`:  Limits operations to a specific Contentful space. Optional.
* `ENVIRONMENT_ID`: Limits operations to a specific environment within a space. Optional, defaults to `master`.
* `APP_ID`: Contentful App ID for App Identity authentication. Required when using `PRIVATE_KEY`.
* `PRIVATE_KEY`: Private key associated with your Contentful App for App Identity authentication. Required when using App Identity.

### Command-line Arguments

These arguments can be used when running `bin/mcp-server.js` to override environment variables:

* `--host`:  Sets the Contentful host.
* `--management-token`: Sets the Contentful Management API token.
* `--space-id`: Sets the Space ID.
* `--environment-id`: Sets the Environment ID.
* `--app-id`: Sets the App ID for App Identity.
* `--private-key`: Sets the Private Key for App Identity.

### Space and Environment Scoping

Setting `SPACE_ID` and `ENVIRONMENT_ID` environment variables restricts the MCP server's operations to the specified space and environment.
If these variables are set, the tools will not require space and environment IDs as input, simplifying usage within a specific Contentful context.

### App Identity Authentication

Instead of a Management API token, you can use Contentful App Identity for authentication.
This method requires:

* `APP_ID`
* `PRIVATE_KEY`
* `SPACE_ID`
* `ENVIRONMENT_ID`

These parameters enable the MCP server to request a temporary AppToken for Contentful operations, enhancing security and suitability for backend systems.

## Public Features / API / Tools

The Contentful MCP Server provides a set of tools for managing Contentful content, spaces, and content models. These tools are accessible through the Model Context Protocol.

### Entry Management Tools

* **search\_entries**: Searches for entries based on query parameters. Returns a maximum of 3 entries per request for pagination.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `query`: Query parameters for searching entries.
      * `content_type`: Content type ID to filter entries.
      * `select`: Fields to include in the response.
      * `limit`: Maximum number of items to return (max: 3). Defaults to 3.
      * `skip`: Number of items to skip for pagination. Defaults to 0.
      * `order`: Field to order results by.
      * `query`: Full-text search query.
* **create\_entry**: Creates a new entry of a specific content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type for the new entry. Required.
    * `fields`: Fields for the new entry. Required.
* **get\_entry**: Retrieves an existing entry by ID.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `entryId`: ID of the entry to retrieve. Required.
* **update\_entry**: Updates an existing entry. Sends all field values, including unchanged fields.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `entryId`: ID of the entry to update. Required.
    * `fields`: Fields to update for the entry. Required.
* **delete\_entry**: Deletes an entry.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `entryId`: ID of the entry to delete. Required.
* **publish\_entry**: Publishes an entry.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `entryId`: ID of the entry to publish. Required.
* **unpublish\_entry**: Unpublishes an entry.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `entryId`: ID of the entry to unpublish. Required.

### Asset Management Tools

* **list\_assets**: Lists assets with pagination (max 3 assets per request).
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `limit`: Maximum number of items to return (max: 3). Defaults to 3.
    * `skip`: Number of items to skip for pagination. Defaults to 0.
* **upload\_asset**: Uploads a new asset.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `title`: Title of the asset. Required.
    * `description`: Description of the asset. Optional.
    * `file`: File details for upload. Required.
      * `upload`: URL of the file to upload. Required.
      * `fileName`: Name of the file. Required.
      * `contentType`: MIME type of the file. Required.
* **get\_asset**: Retrieves an asset by ID.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `assetId`: ID of the asset to retrieve. Required.
* **update\_asset**: Updates an asset's metadata and/or file.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `assetId`: ID of the asset to update. Required.
    * `title`: Updated title of the asset. Optional.
    * `description`: Updated description of the asset. Optional.
    * `file`: Updated file details. Optional.
      * `url`: URL of the new file. Required if updating file.
      * `fileName`: Name of the new file. Required if updating file.
      * `contentType`: MIME type of the new file. Required if updating file.
* **delete\_asset**: Deletes an asset.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `assetId`: ID of the asset to delete. Required.
* **publish\_asset**: Publishes an asset.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `assetId`: ID of the asset to publish. Required.
* **unpublish\_asset**: Unpublishes an asset.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `assetId`: ID of the asset to unpublish. Required.

### Space & Environment Management Tools

These tools are only available if `SPACE_ID` and `ENVIRONMENT_ID` environment variables are not set.

* **list\_spaces**: Lists all available Contentful spaces.
  * **Input Schema Properties:** None.
* **get\_space**: Retrieves details of a specific space.
  * **Input Schema Properties:**
    * `spaceId`: ID of the space to retrieve. Required.
* **list\_environments**: Lists all environments within a space.
  * **Input Schema Properties:**
    * `spaceId`: ID of the space to list environments from. Required.
* **create\_environment**: Creates a new environment in a space.
  * **Input Schema Properties:**
    * `spaceId`: ID of the space to create the environment in. Required.
    * `environmentId`: ID for the new environment. Required.
    * `name`: Name of the new environment. Required.
* **delete\_environment**: Deletes an environment from a space.
  * **Input Schema Properties:**
    * `spaceId`: ID of the space containing the environment. Required.
    * `environmentId`: ID of the environment to delete. Required.

### Content Type Management Tools

* **list\_content\_types**: Lists content types in a space. Returns max 10 content types per request.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `limit`: Maximum number of items to return (max: 20, default: 10).
    * `skip`: Number of items to skip for pagination. Defaults to 0.
* **get\_content\_type**: Retrieves details of a specific content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type to retrieve. Required.
* **get\_editor\_interface**: Retrieves the editor interface configuration for a content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type. Required.
* **update\_editor\_interface**: Updates the editor interface configuration for a content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type. Required.
    * `editorInterface`: Partial editor interface configuration to update. Required.
* **create\_content\_type**: Creates a new content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `name`: Name of the content type. Required.
    * `fields`: Array of field definitions. Required.
    * `description`: Description of the content type. Optional.
    * `displayField`: Field to use as the display field. Optional.
* **update\_content\_type**: Updates an existing content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type to update. Required.
    * `name`: Updated name of the content type. Required.
    * `fields`: Updated array of field definitions. Required.
    * `description`: Updated description. Optional.
    * `displayField`: Updated display field. Optional.
* **delete\_content\_type**: Deletes a content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type to delete. Required.
* **publish\_content\_type**: Publishes a content type.
  * **Input Schema Properties:**
    * `spaceId`:  Contentful Space ID. Required if `SPACE_ID` environment variable is not set.
    * `environmentId`: Contentful Environment ID. Defaults to `master`. Required if `ENVIRONMENT_ID` environment variable is not set.
    * `contentTypeId`: ID of the content type to publish. Required.

## Dependencies and Requirements

* **Node.js:** Version 18 or higher.
* **npm:**  Package manager.
* **Contentful Account:**  A Contentful account with a Space and Content Management API access token or configured App Identity.
* **Dependencies (package.json):**
  * `@contentful/node-apps-toolkit`
  * `@modelcontextprotocol/sdk`
  * `contentful-management`
  * `dotenv`
  * `zod`
  * `zod-to-json-schema`

## Advanced Usage Examples

### Development Mode with MCP Inspector

For development and testing, the MCP Inspector provides a web interface to interact with the tools:

1. Start the inspector in watch mode:

    ```bash
    npm run inspect-watch
    ```

2. Open the inspector in your browser at `http://localhost:5173`.

3. Make changes to the code; the server and inspector will automatically rebuild and restart.

### Using App Identity in Backend Systems

For secure authentication in backend systems, configure the server to use App Identity by setting the `--app-id`, `--private-key`, `--space-id`, and `--environment-id` arguments or corresponding environment variables. This approach is recommended for production environments and systems acting as MCP clients.

### Pagination Handling in AI Agents

When using list operations, the server returns paginated results to prevent context window overflow. AI agents should be designed to interpret the `remainingMessage` and `skip` values in the response. This allows the agent to offer users the option to retrieve subsequent pages of data, enabling efficient navigation through large datasets.
