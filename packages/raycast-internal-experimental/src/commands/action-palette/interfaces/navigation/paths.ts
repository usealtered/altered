import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import type {
    ALTEREDThought,
    ALTEREDThoughtID
} from "@altered/core-experimental/models/thoughts/definitions"
import type { NavigationPath } from "../../../../renderer/navigation/definitions"
import { encodeNavigationPath } from "../../../../renderer/navigation/encode-path"
import { parseNavigationPath } from "../../../../renderer/navigation/parse-path"

function getCollectionItemThoughtByActionId(
    actionId: string
): ALTEREDThought | null {
    return getBuiltinThought({
        query: { id: actionId as ALTEREDThoughtID }
    })
}

function buildNavigationPathForInterface(
    currentPath: NavigationPath,
    thoughtId: ALTEREDThoughtID
) {
    const thought = getBuiltinThought({ query: { id: thoughtId } })

    if (!thought) return null

    // if (!isResolvedInterface(thoughtId)) return null

    return encodeNavigationPath({
        components: [...parseNavigationPath(currentPath), thoughtId]
    })
}

export { buildNavigationPathForInterface, getCollectionItemThoughtByActionId }
