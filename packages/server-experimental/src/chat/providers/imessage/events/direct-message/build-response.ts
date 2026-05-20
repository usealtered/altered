import { botDefaultModelId } from "@altered/core-experimental/config/app"
import { NEW_CONVERSATION_TRIGGER_PHRASES } from "@altered/server-experimental/chat/messages/commands/definitions"
import { generateResponseFromModelMessages } from "../../../../../ai/generate/response-from-model-messages"
import { formatOpenRouterCost } from "../../../../../ai/provider/metadata"
import { getOrCreateActiveConversationForThread } from "../../../../conversations/get-or-create-active-for-thread"
import { startNewConversationForThread } from "../../../../conversations/start-new-for-thread"
import { containsCommandTriggerPhrases } from "../../../../messages/commands/contains-trigger-phrases"
import { listChatMessagesForConversation } from "../../../../messages/list-for-conversation"
import { saveChatMessage } from "../../../../messages/save"
import { toModelMessages } from "../../../../messages/to-model-messages"
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
    const modelMessages = toModelMessages(chatMessages)

    const {
        text: generatedText,

        finishReason,
        elapsedMs,

        providerMetadata
    } = await generateResponseFromModelMessages(modelMessages, {
        prompts: [composeSystemPrompt()]
    })

    const savedAssistantMessage = await saveChatMessage({
        brainId: null,
        content: generatedText,
        conversationId: conversation.id,
        role: "assistant",
        userId: null
    })

    const {
        cost = null,
        promptTokens = null,
        promptTokensDetails: { cachedTokens = null } = {},
        completionTokens = null,
        totalTokens = null
    } = providerMetadata?.openrouter.usage ?? {}

    logImessageEvent("Generation Completed", {
        conversationId: conversation.id,
        messageId: savedAssistantMessage.id,
        elapsedTime: formatElapsedSeconds(elapsedMs),
        totalMessageCount: modelMessages.length,
        messageCharacters: generatedText.length,
        messagePreview: previewText(generatedText),
        modelId: botDefaultModelId,
        promptTokens,
        completionTokens,
        cachedTokens,
        totalTokens,
        cost: cost ? formatOpenRouterCost(cost) : cost,
        finishReason
    })

    return generatedText
}

export { buildDirectMessageResponse }
