import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import { BUILTIN_DATASETS_MAP } from "@altered/core-experimental/data/builtins/definitions/datasets"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"

/**
 * Resolves the interface thought ID for an Action Palette action.
 *
 * @remarks Resolution order:
 * 1. Optional `INTERFACE_ID` attribute → validate target is in Interfaces.
 * 2. Else if the action thought itself is in Interfaces → return self.
 * 3. Else null.
 */
function getActionInterfaceId({
    actionId
}: {
    actionId?: ALTEREDThoughtID
}): ALTEREDThoughtID | null {
    if (!actionId) return null

    const actionThought = getBuiltinThought({ query: { id: actionId } })

    if (!actionThought) {
        console.warn(
            "Action Interface ID Resolution Failed: No thought was found for the provided action ID.",
            { actionId }
        )

        return null
    }

    if (!actionThought.datasetIds.includes(BUILTIN_DATASETS_MAP.ACTIONS.id)) {
        console.warn(
            "Action Interface ID Resolution Failed: Linked thought is not in the Actions dataset.",
            { actionId }
        )

        return null
    }

    const attributes = getBuiltinAttributes({
        query: { ids: actionThought.attributeIds }
    })

    const interfaceIdAttribute = attributes?.find(
        attribute => attribute.schemaId === BUILTIN_SCHEMAS_MAP.INTERFACE_ID.id
    )

    if (interfaceIdAttribute?.value) {
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
                BUILTIN_DATASETS_MAP.INTERFACES.id
            )
        ) {
            console.warn(
                "Action Interface ID Resolution Failed: Linked thought is not in the Interfaces dataset.",
                {
                    actionId,
                    interfaceId,
                    datasetIds: interfaceThought.datasetIds
                }
            )

            return null
        }

        return interfaceThought.id
    }

    if (actionThought.datasetIds.includes(BUILTIN_DATASETS_MAP.INTERFACES.id))
        return actionThought.id

    console.warn(
        "Action Interface ID Resolution Failed: Action has no interface ID attribute and is not itself an interface.",
        { actionId }
    )

    return null
}

export { getActionInterfaceId }
