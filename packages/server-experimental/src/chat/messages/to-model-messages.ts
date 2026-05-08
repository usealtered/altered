import type { ModelMessage } from "ai"
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

export { toModelMessages }
