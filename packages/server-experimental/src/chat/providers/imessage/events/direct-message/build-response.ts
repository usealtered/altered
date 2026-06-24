import { getEnvironmentConfig } from "@altered/core-experimental/config/environment/definitions"
import { NEW_CONVERSATION_TRIGGER_PHRASES } from "@altered/server-experimental/chat/messages/commands/definitions"
import { chatAgent } from "../../../../../ai/agents/chat/definition"
import { resolveAgentInstructions } from "../../../../../ai/agents/utils/resolve-agent-instructions"
import { prepareMessagesForGeneration } from "../../../../../ai/generate/prepare-messages"
import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../../../../../ai/provider/metadata"
import { getOrCreateActiveConversationForThread } from "../../../../conversations/get-or-create-active-for-thread"
import { startNewConversationForThread } from "../../../../conversations/start-new-for-thread"
import { containsCommandTriggerPhrases } from "../../../../messages/commands/contains-trigger-phrases"
import { listChatMessagesForConversation } from "../../../../messages/list-for-conversation"
import { saveChatMessage } from "../../../../messages/save"
import { composeSystemPrompt } from "../../behaviors/generation/compose-system-prompt"
import type { ChatResponseContext } from "../../behaviors/type-and-respond"
import { getImessagePhoneNumberByThread } from "../../get-phone-number-by-thread"
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
        modelId: "anthropic/claude-sonnet-4.6",

        ephemeralPrompt: ephemeralSystemPrompt,
        enableExplicitCacheControl: {
            anthropic: true
        }
    })

    const generationStartedAt = performance.now()

    const {
        shared: { admin }
    } = getEnvironmentConfig()

    const phoneNumber = getImessagePhoneNumberByThread(thread.id)
    if (!phoneNumber)
        throw new Error(
            "iMessage phone number not found. This should never happen."
        )

    /**
     * @todo P3: Some result info, such as `response.modelId`, is only derived from the last step. We should aggregate the details that matter by mapping across the `steps` property.
     */
    const {
        text: generatedText,

        finishReason,
        totalUsage: usage,
        response: { modelId },

        providerMetadata
    } = await chatAgent.generate({
        options: {
            config: {
                systemMessages: resolveAgentInstructions(initialSystemPrompt),

                channel: {
                    provider: "imessage",
                    type: "direct"
                },

                allowAdminTools: admin.phoneNumber === phoneNumber
            },

            context: {
                user: {
                    phoneNumber,

                    planId: "paid"
                }
            }
        },

        messages: modelMessages
    })

    const generationElapsedMs = performance.now() - generationStartedAt

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

    const openrouterProviderMetadata =
        parseOpenrouterProviderMetadata(providerMetadata)?.openrouter ?? {}

    const { usage: { cost = null } = {}, provider: inferenceProvider = null } =
        openrouterProviderMetadata

    logImessageEvent("Generation Completed", {
        messageCount: modelMessages.length,

        modelId,
        inferenceProvider,

        finishReason,
        completionDuration: formatElapsedSeconds(generationElapsedMs),

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
