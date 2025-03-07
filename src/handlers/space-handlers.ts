import { getContentfulClient } from "../config/client.js"

export const spaceHandlers = {
  listSpaces: async () => {
    const contentfulClient = await getContentfulClient()
    const spaces = await contentfulClient.space.getMany({})
    return {
      content: [{ type: "text", text: JSON.stringify(spaces, null, 2) }],
    }
  },

  getSpace: async (args: { spaceId: string }) => {
    const spaceId = args.spaceId
    if (!spaceId) {
      throw new Error("spaceId is required.")
    }

    const contentfulClient = await getContentfulClient()
    const space = await contentfulClient.space.get({ spaceId })
    return {
      content: [{ type: "text", text: JSON.stringify(space, null, 2) }],
    }
  },

  listEnvironments: async (args: { spaceId: string }) => {
    const contentfulClient = await getContentfulClient()
    const environments = await contentfulClient.environment.getMany({
      spaceId: args.spaceId,
    })
    return {
      content: [{ type: "text", text: JSON.stringify(environments, null, 2) }],
    }
  },

  createEnvironment: async (args: { spaceId: string; environmentId: string; name: string }) => {
    const params = {
      spaceId: args.spaceId,
    }

    const environmentProps = {
      name: args.name,
    }

    const contentfulClient = await getContentfulClient()
    const environment = await contentfulClient.environment.create(
      params,
      args.environmentId,
      environmentProps,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(environment, null, 2) }],
    }
  },

  deleteEnvironment: async (args: { spaceId: string; environmentId: string }) => {
    const contentfulClient = await getContentfulClient()
    await contentfulClient.environment.delete({
      spaceId: args.spaceId,
      environmentId: args.environmentId,
    })
    return {
      content: [
        {
          type: "text",
          text: `Environment ${args.environmentId} deleted successfully`,
        },
      ],
    }
  },
}
