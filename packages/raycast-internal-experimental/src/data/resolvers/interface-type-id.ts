import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"
import type { InterfaceTypeID } from "../../renderer/definitions"

function resolveInterfaceTypeId({
    interfaceThoughtAttributes
}: {
    interfaceThoughtAttributes: ALTEREDAttribute[]
}): InterfaceTypeID | null {
    const interfaceTypeIdAttribute = findAttributeBySchemaId(
        interfaceThoughtAttributes,
        { schemaId: BUILTIN_SCHEMAS_MAP.INTERFACE_TYPE.id }
    )

    if (!interfaceTypeIdAttribute) {
        console.warn(
            "Interface Type ID Resolution Failed: No Interface Type ID attribute was found in the provided attributes.",
            { attributes: interfaceThoughtAttributes }
        )

        return null
    }

    return interfaceTypeIdAttribute.value as InterfaceTypeID
}

export { resolveInterfaceTypeId }
