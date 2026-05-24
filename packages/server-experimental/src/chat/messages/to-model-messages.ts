import type { ModelMessage } from "ai"
import {
    formatChatMessageDateTimeMetadata,
    formatChatMessageMetadataPrefix
} from "../../ai/prompts/format-message-metadata-prefix"
import { modelMessageWithMetadataPrefix } from "./model-message-with-metadata"
import type { ChatMessage } from "./schema"

/**
 * @remarks Since `ModelMessage` is union of role-to-content types, we cannot join it's components without noise so we must cast. `ChatMessage` is assumed to be written by the AI SDK's `ModelMessage` type.
 */
function chatMessageToModelMessage({
    role,
    content
}: ChatMessage): ModelMessage {
    return { content, role } as ModelMessage
}

function toModelMessages(messages: ChatMessage[]): ModelMessage[] {
    return messages.map(chatMessageToModelMessage)
}

/**
 * Prepends all message content with embedded metadata, except for the last message.
 *
 * @todo
 * - P2: We should relocate the prefix construction to somewhere more appropriate.
 * - P2: We should handle the "last message" control flow differently - perhaps only passing the relevant messages into the prefix function, rather than having a special case here. The control flow should be designed in a way that keeps it parallel to the one in `prepareMessagesForGeneration`.
 *
 * @remarks Prepended date-time metadata is intended for generation only, and not for persisting in the database.
 */
function toModelMessagesForGeneration(messages: ChatMessage[]): ModelMessage[] {
    return messages.map((message, index) => {
        const modelMessage = chatMessageToModelMessage(message)

        const lastMessageIndex = messages.length - 1
        if (index === lastMessageIndex) return modelMessage

        return modelMessageWithMetadataPrefix(
            modelMessage,
            formatChatMessageMetadataPrefix([
                formatChatMessageDateTimeMetadata(message.createdAt)
            ])
        )
    })
}

export { toModelMessages, toModelMessagesForGeneration }
