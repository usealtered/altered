import {
    type FinishReason,
    generateText,
    type LanguageModelUsage,
    type ModelMessage
} from "ai"
import { constructPrompts } from "../prompts/constructor"
import { IDENTITY_SYSTEM_PROMPT } from "../prompts/identity"
import { createOpenRouterChatModel } from "../provider/create-chat-model"
import {
    type OpenRouterProviderMetadata,
    parseOpenRouterProviderMetadata
} from "../provider/metadata"

type GenerateResponseFromModelMessagesResult = {
    text: string

    modelId: string
    finishReason: FinishReason
    usage: LanguageModelUsage
    elapsedMs: number

    providerMetadata: OpenRouterProviderMetadata | null
}

/**
 * @remarks Coming up, we may want to return the entire message part/content rather than just the text.
 */
async function generateResponseFromModelMessages(
    messages: ModelMessage[],
    config?: { prompts?: string[] }
): Promise<GenerateResponseFromModelMessagesResult> {
    const { prompts = [IDENTITY_SYSTEM_PROMPT] } = config ?? {}

    const startedAt = performance.now()

    const {
        text,
        finishReason,
        usage,
        providerMetadata,
        response: { modelId }
    } = await generateText({
        model: createOpenRouterChatModel(),

        system: constructPrompts(prompts),

        messages
    })

    return {
        text,

        modelId,
        finishReason,
        usage,
        elapsedMs: Math.round(performance.now() - startedAt),

        providerMetadata: parseOpenRouterProviderMetadata(providerMetadata)
    }
}

export {
    type GenerateResponseFromModelMessagesResult,
    generateResponseFromModelMessages
}
