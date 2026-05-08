import { asc, eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { chatMessages } from "./schema"

function listChatMessagesForConversation(conversationId: string) {
    const db = getDatabase()

    return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, conversationId))
        .orderBy(asc(chatMessages.createdAt))
}

export { listChatMessagesForConversation }
