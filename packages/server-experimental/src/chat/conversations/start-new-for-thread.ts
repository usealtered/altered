import { and, eq } from "drizzle-orm"
import { getDatabase } from "../../storage/database/connection"
import { getExternalResourceTypeId } from "../../storage/database/external-resources/get-id"
import { externalResources } from "../../storage/database/external-resources/schema"
import type { ProviderKey } from "../providers/definitions"
import { getProviderId } from "../providers/get-id"
import { conversations } from "./schema"

/**
 * @todo P1: Convert errors to Effect.
 */
function startNewConversationForThread({
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

    return db.transaction(async tx => {
        const [conversation] = await tx
            .insert(conversations)
            .values({ providerId })
            .returning()

        if (!conversation) throw new Error("Failed to insert conversation row.")

        const [externalResource] = await tx
            .select()
            .from(externalResources)
            .where(
                and(
                    eq(externalResources.resourceTypeId, resourceTypeId),
                    eq(externalResources.referenceId, threadId)
                )
            )
            .limit(1)

        if (externalResource) {
            await tx
                .update(externalResources)
                .set({ conversationId: conversation.id })
                .where(eq(externalResources.id, externalResource.id))
        } else {
            await tx.insert(externalResources).values({
                conversationId: conversation.id,
                referenceId: threadId,
                resourceTypeId
            })
        }

        return conversation
    })
}

export { startNewConversationForThread }
