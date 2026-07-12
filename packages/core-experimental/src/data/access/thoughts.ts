import type {
    ALTEREDThought,
    ALTEREDThoughtID
} from "../../models/thoughts/definitions"
import {
    getBuiltinThought,
    getBuiltinThoughts
} from "../builtins/access/thoughts"

async function getThought({
    query
}: {
    query: { id?: ALTEREDThoughtID }
}): Promise<ALTEREDThought | null> {
    const builtinThought = getBuiltinThought({ query })
    if (builtinThought) return builtinThought

    //  TODO P2: Fetch from database when no builtins are found.

    await new Promise(resolve => setTimeout(resolve, 3000))

    return null
}

async function getThoughts({
    query
}: {
    query: { ids?: ALTEREDThoughtID[] }
}): Promise<ALTEREDThought[] | null> {
    const builtinThoughts = getBuiltinThoughts({ query })
    if (builtinThoughts) return builtinThoughts

    //  TODO P2: Fetch from database when no builtins are found.

    await new Promise(resolve => setTimeout(resolve, 3000))

    return null
}

export { getThought, getThoughts }
