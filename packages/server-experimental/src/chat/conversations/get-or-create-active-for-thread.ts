import { and, eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { getExternalResourceTypeId } from "../../storage/database/external-resources/get-id"
import { externalResources } from "../../storage/database/external-resources/schema"
import type { ProviderKey } from "../providers/definitions"
import { getProviderId } from "../providers/get-id"
import { conversations } from "./schema"

async function getOrCreateActiveConversationForThread({
    provider,

    threadId
}: {
    provider: ProviderKey

    threadId: string
}) {
    const providerId = getProviderId(provider)

    const resourceTypeId = getExternalResourceTypeId({
        provider,
        type: "thread"
    })

    const db = getDatabase()

    const [externalResource] = await db
        .select()
        .from(externalResources)
        .where(
            and(
                eq(externalResources.resourceTypeId, resourceTypeId),
                eq(externalResources.referenceId, threadId)
            )
        )
        .limit(1)

    const conversationId = externalResource?.conversationId

    if (conversationId) {
        const [existingConversation] = await db
            .select()
            .from(conversations)
            .where(eq(conversations.id, conversationId))
            .limit(1)

        if (existingConversation) return existingConversation
    }

    return db.transaction(async tx => {
        const [newConversation] = await tx
            .insert(conversations)
            .values({ providerId })
            .returning()

        if (!newConversation)
            throw new Error("Failed to insert conversation row.")

        await tx.insert(externalResources).values({
            conversationId: newConversation.id,
            referenceId: threadId,
            resourceTypeId
        })

        return newConversation
    })
}

export { getOrCreateActiveConversationForThread }
