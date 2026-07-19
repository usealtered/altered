import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import { resolveThoughtIdsFromDatasetAttribute } from "@altered/core-experimental/data/resolvers/thought-ids-from-dataset-attribute"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import { resolveCollectionItemInterfaceThought } from "../../data/resolvers/collection-item-interface-thought"

function isParentChildCollectionInterfaceRelation({
    parent,

    child
}: {
    parent: { attributes: ALTEREDAttribute[] }

    child: { id: ALTEREDThoughtID }
}): boolean {
    const collectionItemsAttribute =
        parent.attributes.find(
            attribute =>
                attribute.schemaId ===
                BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEMS.id
        ) ?? null

    if (!collectionItemsAttribute) return false

    const collectionItemThoughtIds = resolveThoughtIdsFromDatasetAttribute(
        collectionItemsAttribute
    )

    if (!collectionItemThoughtIds) return false

    for (const collectionItemThoughtId of collectionItemThoughtIds) {
        const collectionItemInterface = resolveCollectionItemInterfaceThought({
            collectionItemThoughtId
        })

        if (collectionItemInterface && collectionItemInterface.id === child.id)
            return true
    }

    return false
}

export { isParentChildCollectionInterfaceRelation }
