import { defineRelations } from "drizzle-orm"
import { schema } from "./schema"

const relations = defineRelations(schema, r => ({
    conversations: {
        messages: r.many.messages({
            from: r.conversations.id,
            to: r.messages.conversationId
        }),
        externalResources: r.many.externalResources({
            from: r.conversations.id,
            to: r.externalResources.conversationId
        })
    },

    messages: {
        conversation: r.one.conversations({
            from: r.messages.conversationId,
            to: r.conversations.id
        }),
        externalResources: r.many.externalResources({
            from: r.messages.id,
            to: r.externalResources.messageId
        })
    },

    externalResources: {
        conversation: r.one.conversations({
            from: r.externalResources.conversationId,
            to: r.conversations.id
        }),
        message: r.one.messages({
            from: r.externalResources.messageId,
            to: r.messages.id
        })
    }
}))

export { relations }
