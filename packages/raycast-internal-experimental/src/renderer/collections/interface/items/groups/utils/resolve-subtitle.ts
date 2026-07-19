import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"

function resolveCollectionItemGroupSubtitle({
    groupAttributes
}: {
    groupAttributes: ALTEREDAttribute[] | null
}): string | null {
    if (!groupAttributes) return null

    const groupSubtitleAttribute = findAttributeBySchemaId(groupAttributes, {
        schemaId:
            BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE.id
    })

    if (!groupSubtitleAttribute) {
        console.warn(
            "Collection Interface: No associated collection item group subtitle attribute was found for the collection item group.",
            { groupAttributes }
        )

        return null
    }

    return groupSubtitleAttribute.value
}

export { resolveCollectionItemGroupSubtitle }
