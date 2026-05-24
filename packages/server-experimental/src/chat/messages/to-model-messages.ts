import type { ModelMessage } from "ai"
import { formatDateTime } from "../../ai/prompts/environment"
import { modelMessageWithMetadata } from "./model-message-with-metadata"
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
 * @remarks Prepended date-time metadata is intended for generation only, and not for persisting in the database.
 */
function toModelMessagesForGeneration(messages: ChatMessage[]): ModelMessage[] {
    return messages.map(message =>
        modelMessageWithMetadata(chatMessageToModelMessage(message), {
            CREATED_AT: formatDateTime(message.createdAt)
        })
    )
}

export { toModelMessages, toModelMessagesForGeneration }
