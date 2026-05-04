import { asc, eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { messages } from "./schema"

function listMessagesForConversation(conversationId: string) {
    const db = getDatabase()

    return db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(asc(messages.createdAt))
}

export { listMessagesForConversation }
