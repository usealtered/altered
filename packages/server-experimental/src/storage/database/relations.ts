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
        }),
        agentRuns: r.many.agentRuns({
            from: r.conversations.id,
            to: r.agentRuns.conversationId
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
        }),
        agentRuns: r.many.agentRuns({
            from: r.chatMessages.id,
            to: r.agentRuns.chatMessageId
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
    },

    thoughts: {
        datasets: r.many.datasets({
            from: r.thoughts.id.through(r.thoughtsToDatasets.thoughtId),
            to: r.datasets.id.through(r.thoughtsToDatasets.datasetId)
        }),
        attributes: r.many.attributes({
            from: r.thoughts.id,
            to: r.attributes.thoughtId
        }),
        tags: r.many.tags({
            from: r.thoughts.id,
            to: r.tags.thoughtId
        }),
        agentRuns: r.many.agentRuns({
            from: r.thoughts.id,
            to: r.agentRuns.thoughtId
        })
    },

    datasets: {
        thoughts: r.many.thoughts({
            from: r.datasets.id.through(r.thoughtsToDatasets.datasetId),
            to: r.thoughts.id.through(r.thoughtsToDatasets.thoughtId)
        })
    },

    attributes: {
        thought: r.one.thoughts({
            from: r.attributes.thoughtId,
            to: r.thoughts.id
        })
    },

    tags: {
        thought: r.one.thoughts({
            from: r.tags.thoughtId,
            to: r.thoughts.id
        })
    },

    agentRuns: {
        conversation: r.one.conversations({
            from: r.agentRuns.conversationId,
            to: r.conversations.id
        }),
        chatMessage: r.one.chatMessages({
            from: r.agentRuns.chatMessageId,
            to: r.chatMessages.id
        }),
        thought: r.one.thoughts({
            from: r.agentRuns.thoughtId,
            to: r.thoughts.id
        })
    }
}))

export { relations }
