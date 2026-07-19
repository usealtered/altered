import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"

/**
 * @todo P2: Support sentinel self-references in attribute values
 * (e.g. `$self.alias`, `$self.content`, `$self.id`).
 *
 * @todo P3: Support a `custom` schema expression language for richer
 * self/cross-property references beyond sentinels.
 */
function resolveCollectionItemTitle({
    attributes
}: {
    attributes: ALTEREDAttribute[] | null
}): string | null {
    if (!attributes) return null

    const titleAttribute = findAttributeBySchemaId(attributes, {
        schemaId: BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEM_TITLE.id
    })

    if (!titleAttribute) {
        console.warn(
            "Collection Interface: No associated collection item title attribute was found for the collection item.",
            { attributes }
        )

        return null
    }

    return titleAttribute.value
}

export { resolveCollectionItemTitle }
