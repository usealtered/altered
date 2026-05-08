import { defineRelations } from "drizzle-orm"
import { schema } from "./schema"

const relations = defineRelations(schema, r => ({
    conversations: {
        chatMessages: r.many.chatMessages({
            from: r.conversations.id,
            to: r.chatMessages.conversationId
        }),
        externalResources: r.many.externalResources({
            from: r.conversations.id,
            to: r.externalResources.conversationId
        })
    },

    chatMessages: {
        conversation: r.one.conversations({
            from: r.chatMessages.conversationId,
            to: r.conversations.id
        }),
        externalResources: r.many.externalResources({
            from: r.chatMessages.id,
            to: r.externalResources.messageId
        })
    },

    externalResources: {
        conversation: r.one.conversations({
            from: r.externalResources.conversationId,
            to: r.conversations.id
        }),
        message: r.one.chatMessages({
            from: r.externalResources.messageId,
            to: r.chatMessages.id
        })
    }
}))

export { relations }
