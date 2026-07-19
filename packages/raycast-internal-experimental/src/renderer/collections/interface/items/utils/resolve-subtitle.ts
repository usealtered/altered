import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"

/**
 * @todo P2: Support `$self.content` (and related) sentinel self-references.
 *
 * @todo P3: Support custom schema expressions for subtitle composition.
 */
function resolveCollectionItemSubtitle({
    attributes
}: {
    attributes: ALTEREDAttribute[] | null
}): string | null {
    if (!attributes) return null

    const subtitleAttribute = findAttributeBySchemaId(attributes, {
        schemaId: BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE.id
    })

    if (!subtitleAttribute) {
        console.warn(
            "Collection Interface: No associated collection item subtitle attribute was found for the collection item.",
            { attributes }
        )

        return null
    }

    return subtitleAttribute.value
}

export { resolveCollectionItemSubtitle }
