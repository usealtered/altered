import type {
    ALTEREDAttribute,
    ALTEREDAttributeID
} from "../../models/attributes/definitions"
import {
    getBuiltinAttribute,
    getBuiltinAttributes
} from "../builtins/access/attributes"

async function getAttribute({
    query
}: {
    query: { id: ALTEREDAttributeID | null }
}): Promise<ALTEREDAttribute | null> {
    const builtinAttribute = getBuiltinAttribute({ query })
    if (builtinAttribute) return builtinAttribute

    //  TODO P2: Fetch from database when no builtins are found.

    await new Promise(resolve => setTimeout(resolve, 3000))

    return null
}

async function getAttributes({
    query
}: {
    query: { ids: ALTEREDAttributeID[] | null }
}): Promise<ALTEREDAttribute[] | null> {
    const builtinAttributes = getBuiltinAttributes({ query })
    if (builtinAttributes) return builtinAttributes

    //  TODO P2: Fetch from database when no builtins are found.

    await new Promise(resolve => setTimeout(resolve, 3000))

    return null
}

export { getAttribute, getAttributes }
