import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import { BUILTIN_DATASETS_MAP } from "@altered/core-experimental/data/builtins/definitions/datasets"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"

function isInterfaceThoughtId(id: ALTEREDThoughtID): boolean {
    const thought = getBuiltinThought({ query: { id } })
    if (!thought) return false

    if (thought.datasetIds.includes(BUILTIN_DATASETS_MAP.INTERFACES.id))
        return true

    const attributes = getBuiltinAttributes({
        query: { ids: thought.attributeIds }
    })
    if (!attributes) return false

    const interfaceIdAttribute = attributes.find(
        attribute => attribute.schemaId === BUILTIN_SCHEMAS_MAP.INTERFACE_ID.id
    )
    if (!interfaceIdAttribute) return false

    if (interfaceIdAttribute.value === id) return true
    return false
}

export { isInterfaceThoughtId }
