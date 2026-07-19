import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"

/**
 * @remarks We might not want to warn for missing icon attributes, if they're not required. We could maybe universalize this resolver to read the `required` schema property, and additionally wire up a `debugLevel` context variable to control logs, if not done in Effect.
 */
function resolveCollectionItemIconId({
    attributes
}: {
    attributes: ALTEREDAttribute[] | null
}): string | null {
    if (!attributes) return null

    const iconIdAttribute = findAttributeBySchemaId(attributes, {
        schemaId: BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEM_ICON.id
    })

    if (!iconIdAttribute) {
        console.warn(
            "Collection Interface: No associated collection item icon ID attribute was found for the collection item.",
            { attributes }
        )

        return null
    }

    return iconIdAttribute.value
}

export { resolveCollectionItemIconId }
