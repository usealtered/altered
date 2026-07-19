import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"

/**
 * @todo P3: Generalize this resolver among siblings.
 */
function resolveCollectionItemTriggerPhrase({
    attributes
}: {
    attributes: ALTEREDAttribute[] | null
}): string | null {
    if (!attributes) return null

    const triggerPhraseAttribute = findAttributeBySchemaId(attributes, {
        schemaId:
            BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE.id
    })

    if (!triggerPhraseAttribute) {
        console.warn(
            "Collection Interface: No associated collection item trigger phrase attribute was found for the collection item.",
            { attributes }
        )

        return null
    }

    return triggerPhraseAttribute.value
}

export { resolveCollectionItemTriggerPhrase }
