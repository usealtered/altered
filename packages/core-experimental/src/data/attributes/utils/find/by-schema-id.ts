import type { ALTEREDAttribute } from "../../../../models/attributes/definitions"
import type { ALTEREDSchemaID } from "../../../../models/schemas/definitions"

/**
 * @todo P3: Decide whether 'find' utils should be consolidated as 'resolvers', and if this should be a generalized `findAttribute` - then integrate into `getAttributes`.
 */
function findAttributeBySchemaId(
    attributes: ALTEREDAttribute[],

    query: { schemaId: ALTEREDSchemaID | null }
): ALTEREDAttribute | null {
    if (!query.schemaId) return null

    const attribute = attributes.find(
        attribute => attribute.schemaId === query.schemaId
    )

    if (!attribute) return null

    return attribute
}

export { findAttributeBySchemaId }
