/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContentfulClient } from "../config/client.js"
import type {
  ContentTypeProps,
  CreateContentTypeProps,
  EditorInterfaceProps,
} from "contentful-management"

export const contentTypeHandlers = {
  listContentTypes: async (args: { spaceId: string; environmentId: string }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
    }

    const contentfulClient = await getContentfulClient()
    const contentTypes = await contentfulClient.contentType.getMany(params)

    // Extract only the name, ID, and description from each content type
    const simplifiedContentTypes = contentTypes.items.map((contentType) => ({
      id: contentType.sys.id,
      name: contentType.name,
      description: contentType.description || "",
    }))

    return {
      content: [{ type: "text", text: JSON.stringify(simplifiedContentTypes, null, 2) }],
    }
  },
  getContentType: async (args: {
    spaceId: string
    environmentId: string
    contentTypeId: string
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
      contentTypeId: args.contentTypeId,
    }

    const contentfulClient = await getContentfulClient()
    const contentType = await contentfulClient.contentType.get(params)

    return {
      content: [{ type: "text", text: JSON.stringify(contentType, null, 2) }],
    }
  },

  createContentType: async (args: {
    spaceId: string
    environmentId: string
    name: string
    fields: any[]
    description?: string
    displayField?: string
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
    }

    const contentTypeProps: CreateContentTypeProps = {
      name: args.name,
      fields: args.fields,
      description: args.description || "",
      displayField: args.displayField || args.fields[0]?.id || "",
    }

    const contentfulClient = await getContentfulClient()
    const contentType = await contentfulClient.contentType.create(params, contentTypeProps)
    return {
      content: [{ type: "text", text: JSON.stringify(contentType, null, 2) }],
    }
  },

  updateContentType: async (args: {
    spaceId: string
    environmentId: string
    contentTypeId: string
    name: string
    fields: any[]
    description?: string
    displayField?: string
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
      contentTypeId: args.contentTypeId,
    }

    const contentfulClient = await getContentfulClient()
    const currentContentType = await contentfulClient.contentType.get(params)

    const contentTypeProps: ContentTypeProps = {
      name: args.name,
      fields: args.fields,
      description: args.description || currentContentType.description || "",
      displayField: args.displayField || currentContentType.displayField || "",
      sys: currentContentType.sys,
    }

    const contentType = await contentfulClient.contentType.update(params, contentTypeProps)
    return {
      content: [{ type: "text", text: JSON.stringify(contentType, null, 2) }],
    }
  },

  deleteContentType: async (args: {
    spaceId: string
    environmentId: string
    contentTypeId: string
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
      contentTypeId: args.contentTypeId,
    }

    const contentfulClient = await getContentfulClient()
    await contentfulClient.contentType.delete(params)
    return {
      content: [
        {
          type: "text",
          text: `Content type ${args.contentTypeId} deleted successfully`,
        },
      ],
    }
  },

  publishContentType: async (args: {
    spaceId: string
    environmentId: string
    contentTypeId: string
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
      contentTypeId: args.contentTypeId,
    }

    const contentfulClient = await getContentfulClient()
    const contentType = await contentfulClient.contentType.get(params)
    await contentfulClient.contentType.publish(params, contentType)

    return {
      content: [
        {
          type: "text",
          text: `Content type ${args.contentTypeId} published successfully`,
        },
      ],
    }
  },

  getEditorInterface: async (args: {
    spaceId: string
    environmentId: string
    contentTypeId: string
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
      contentTypeId: args.contentTypeId,
    }

    const contentfulClient = await getContentfulClient()
    const editorInterface = await contentfulClient.editorInterface.get(params)

    return {
      content: [{ type: "text", text: JSON.stringify(editorInterface, null, 2) }],
    }
  },

  updateEditorInterface: async (args: {
    spaceId: string
    environmentId: string
    contentTypeId: string
    editorInterface: Partial<EditorInterfaceProps>
  }) => {
    const spaceId = process.env.SPACE_ID || args.spaceId
    const environmentId = process.env.ENVIRONMENT_ID || args.environmentId

    const params = {
      spaceId,
      environmentId,
      contentTypeId: args.contentTypeId,
    }

    const contentfulClient = await getContentfulClient()

    // Get the current editor interface to ensure we have the latest version
    const currentEditorInterface = await contentfulClient.editorInterface.get(params)

    // Merge the current editor interface with the provided updates
    // This ensures we maintain the sys property which contains the version
    const updatedEditorInterface = {
      ...currentEditorInterface,
      ...args.editorInterface,
      sys: currentEditorInterface.sys,
    }

    // Update the editor interface
    const result = await contentfulClient.editorInterface.update(params, updatedEditorInterface)

    // After updating the editor interface, we need to publish the content type
    // to make the changes visible in the Contentful web app
    const contentType = await contentfulClient.contentType.get(params)
    await contentfulClient.contentType.publish(params, contentType)

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    }
  },
}
