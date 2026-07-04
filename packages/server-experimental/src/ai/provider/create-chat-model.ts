import type { LanguageModelID } from "@altered/core-experimental/config/ai"
import type { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createOpenRouterChatModelOptions } from "./create-chat-model-options"
import { getOpenRouter } from "./instance"

function createOpenrouterChatModel(options: {
    modelId: LanguageModelID
}): ReturnType<ReturnType<typeof createOpenRouter>["chat"]> {
    const { modelId } = options

    const openRouter = getOpenRouter()

    return openRouter.chat(
        modelId,
        createOpenRouterChatModelOptions({ modelId })
    )
}

export { createOpenrouterChatModel }
