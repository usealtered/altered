import { getDatabase } from "../../storage/database/connection"
import {
    type ChatMessageContent,
    type ChatMessageRole,
    chatMessages
} from "./schema"

/**
 * @todo P1: When auth is implemented, make the `userId` and `brainId` non-nullable.
 *
 * @todo P1: Convert errors to Effect.
 */
async function saveChatMessage(values: {
    userId: string | null
    brainId: string | null
    conversationId: string

    role: ChatMessageRole
    content: ChatMessageContent
}) {
    const db = getDatabase()

    const [savedMessage] = await db
        .insert(chatMessages)
        .values(values)
        .returning()

    if (!savedMessage) throw new Error("Failed to save chat message.")

    return savedMessage
}

export { saveChatMessage }
