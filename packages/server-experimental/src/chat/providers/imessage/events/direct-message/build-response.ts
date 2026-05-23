import { botDefaultModelId } from "@altered/core-experimental/config/app"
import { NEW_CONVERSATION_TRIGGER_PHRASES } from "@altered/server-experimental/chat/messages/commands/definitions"
import { prepareMessagesForGeneration } from "../../../../../ai/generate/prepare-messages"
import { generateResponseFromModelMessages } from "../../../../../ai/generate/response-from-model-messages"
import { formatOpenRouterCost } from "../../../../../ai/provider/metadata"
import { getOrCreateActiveConversationForThread } from "../../../../conversations/get-or-create-active-for-thread"
import { startNewConversationForThread } from "../../../../conversations/start-new-for-thread"
import { containsCommandTriggerPhrases } from "../../../../messages/commands/contains-trigger-phrases"
import { listChatMessagesForConversation } from "../../../../messages/list-for-conversation"
import { saveChatMessage } from "../../../../messages/save"
import { composeSystemPrompt } from "../../behaviors/generation/compose-system-prompt"
import type { ChatResponseContext } from "../../behaviors/type-and-respond"
import {
    formatElapsedSeconds,
    logImessageEvent,
    previewText
} from "../../logging"

async function buildDirectMessageResponse({
    thread,
    message
}: ChatResponseContext): Promise<string> {
    const { text: inboundMessageText } = message

    if (
        containsCommandTriggerPhrases({
            message: inboundMessageText,
            phrases: [...NEW_CONVERSATION_TRIGGER_PHRASES]
        })
    ) {
        await startNewConversationForThread({
            chatProvider: "sendblue",
            threadId: thread.id
        })

        return "Started a new conversation."
    }

    const conversation = await getOrCreateActiveConversationForThread({
        chatProvider: "sendblue",
        threadId: thread.id
    })

    await saveChatMessage({
        brainId: null,
        content: inboundMessageText,
        conversationId: conversation.id,
        role: "user",
        userId: null
    })

    const chatMessages = await listChatMessagesForConversation(conversation.id)

    const { initial: initialSystemPrompt, ephemeral: ephemeralSystemPrompt } =
        composeSystemPrompt()

    const modelMessages = prepareMessagesForGeneration(chatMessages, {
        modelId: botDefaultModelId,

        ephemeralPrompt: ephemeralSystemPrompt,
        enableExplicitCacheControl: {
            anthropic: true
        }
    })

    const {
        text: generatedText,

        modelId,
        finishReason,
        elapsedMs,
        usage,

        providerMetadata
    } = await generateResponseFromModelMessages(modelMessages, {
        prompts: [initialSystemPrompt]
    })

    const savedAssistantMessage = await saveChatMessage({
        brainId: null,
        content: generatedText,
        conversationId: conversation.id,
        role: "assistant",
        userId: null
    })

    const {
        inputTokenDetails: {
            noCacheTokens = null,
            cacheReadTokens = null,
            cacheWriteTokens = null
        },

        outputTokenDetails: {
            reasoningTokens = null,
            textTokens: completionTokens = null
        },

        inputTokens: totalInputTokens = null,
        outputTokens: totalOutputTokens = null,

        totalTokens = null
    } = usage ?? {}

    const { usage: { cost = null } = {}, provider: inferenceProvider = null } =
        providerMetadata?.openrouter ?? {}

    logImessageEvent("Generation Completed", {
        messageCount: modelMessages.length,

        modelId,
        inferenceProvider,

        finishReason,
        completionDuration: formatElapsedSeconds(elapsedMs),

        completionCharacters: generatedText.length,
        completionPreview: previewText(generatedText),

        inputTokens: {
            cacheRead: cacheReadTokens,
            cacheWrite: cacheWriteTokens,
            noCache: noCacheTokens,
            total: totalInputTokens
        },
        outputTokens: {
            reasoning: reasoningTokens,
            completion: completionTokens,
            total: totalOutputTokens
        },
        totalTokens,

        cost: cost ? formatOpenRouterCost(cost) : cost,

        messageId: savedAssistantMessage.id,
        conversationId: conversation.id
    })

    return generatedText
}

export { buildDirectMessageResponse }
