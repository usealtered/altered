import { botDefaultModelId } from "@altered/core-experimental/config/app"
import type { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { getOpenRouter } from "./instance"

function isAnthropicModelId(modelId: string): boolean {
    return modelId.startsWith("anthropic/")
}

function createOpenRouterChatModel(
    modelId: string = botDefaultModelId
): ReturnType<ReturnType<typeof createOpenRouter>["chat"]> {
    const openRouter = getOpenRouter()

    return openRouter.chat(modelId, {
        usage: { include: true },

        ...(isAnthropicModelId(modelId)
            ? {
                  cache_control: {
                      type: "ephemeral",

                      /**
                       * @remarks Initial writes cost more, but could actually be significantly cheaper if we continuously refresh within the hour.
                       */
                      ttl: "1h"
                  }
              }
            : {})
    })
}

export { createOpenRouterChatModel, type isAnthropicModelId }
