import { getDatabase } from "../../storage/database/connection"
import { type MessageContent, type MessageRole, messages } from "./schema"

/**
 * @todo P1: When auth is implemented, make the `userId` and `brainId` non-nullable.
 *
 * @todo P1: Convert errors to Effect.
 */
async function saveMessage(values: {
    userId: string | null
    brainId: string | null
    conversationId: string

    role: MessageRole
    content: MessageContent
}) {
    const db = getDatabase()

    const [row] = await db.insert(messages).values(values).returning()

    if (!row) throw new Error("Failed to save message.")

    return row
}

export { saveMessage }
