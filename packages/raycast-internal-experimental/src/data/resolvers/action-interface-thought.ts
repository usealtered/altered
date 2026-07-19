import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import { BUILTIN_DATASETS_MAP } from "@altered/core-experimental/data/builtins/definitions/datasets"
import type {
    ALTEREDThought,
    ALTEREDThoughtID
} from "@altered/core-experimental/models/thoughts/definitions"
import { resolveCollectionItemInterfaceThought } from "./collection-item-interface-thought"

function resolveActionInterfaceThought({
    actionThoughtId
}: {
    actionThoughtId: ALTEREDThoughtID | null
}): ALTEREDThought | null {
    const actionThought = getBuiltinThought({
        query: { id: actionThoughtId }
    })

    if (!actionThought) {
        console.warn(
            "Action Interface Thought Resolution Failed: No thought was found for the provided action thought ID.",
            { actionThoughtId }
        )

        return null
    }

    if (!actionThought.datasetIds.includes(BUILTIN_DATASETS_MAP.ACTIONS.id)) {
        console.warn(
            "Action Interface Thought Resolution Failed: The action thought is not in the 'Actions' dataset.",
            { actionThought }
        )

        return null
    }

    const collectionItemInterfaceThought =
        resolveCollectionItemInterfaceThought({
            collectionItemThoughtId: actionThoughtId
        })

    if (!collectionItemInterfaceThought) {
        console.warn(
            "Action Interface Thought Resolution Failed: No resolvable interface was found for the action thought.",
            { actionThought }
        )

        return null
    }

    return collectionItemInterfaceThought
}

export { resolveActionInterfaceThought }
