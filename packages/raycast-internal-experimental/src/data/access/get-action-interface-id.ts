import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import { BUILTIN_DATASETS_MAP } from "@altered/core-experimental/data/builtins/definitions/datasets"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"

function getActionInterfaceId({
    actionId
}: {
    actionId?: ALTEREDThoughtID
}): ALTEREDThoughtID | null {
    if (!actionId) {
        console.warn(
            "Action Interface ID Resolution Failed: No action ID was provided."
        )

        return null
    }

    const actionThought = getBuiltinThought({ query: { id: actionId } })

    if (!actionThought) {
        console.warn(
            "Action Interface ID Resolution Failed: No thought was found for the provided action ID.",
            { actionId }
        )

        return null
    }

    if (
        !actionThought.datasetIds.includes(
            BUILTIN_DATASETS_MAP.ACTIONS_DATASET.id
        )
    ) {
        console.warn(
            "Action Interface ID Resolution Failed: Thought is not in the Actions dataset.",
            { actionId, datasetIds: actionThought.datasetIds }
        )

        return null
    }

    const attributes = getBuiltinAttributes({
        query: { ids: actionThought.attributeIds }
    })

    const interfaceIdAttribute = attributes?.find(
        attribute =>
            attribute.schemaId ===
            BUILTIN_SCHEMAS_MAP.ACTION_INTERFACE_ID_SCHEMA.id
    )

    if (!interfaceIdAttribute?.value) {
        console.warn(
            "Action Interface ID Resolution Failed: Action has no interface ID attribute value.",
            { actionId }
        )

        return null
    }

    const interfaceId = interfaceIdAttribute.value as ALTEREDThoughtID

    const interfaceThought = getBuiltinThought({
        query: { id: interfaceId }
    })

    if (!interfaceThought) {
        console.warn(
            "Action Interface ID Resolution Failed: Interface thought does not exist for the attribute value.",
            { actionId, interfaceId }
        )

        return null
    }

    if (
        !interfaceThought.datasetIds.includes(
            BUILTIN_DATASETS_MAP.INTERFACES_DATASET.id
        )
    ) {
        console.warn(
            "Action Interface ID Resolution Failed: Linked thought is not in the Interfaces dataset.",
            { actionId, interfaceId, datasetIds: interfaceThought.datasetIds }
        )

        return null
    }

    return interfaceThought.id
}

export { getActionInterfaceId }
