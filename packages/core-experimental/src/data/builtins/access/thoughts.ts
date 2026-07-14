import type { ALTEREDThought } from "../../../models/thoughts/definitions"
import { BUILTIN_THOUGHTS } from "../definitions/thoughts"
import { createBuiltinDataGetter } from "./generic"

const { getMany: getBuiltinThoughts, getOne: getBuiltinThought } =
    createBuiltinDataGetter<ALTEREDThought>({
        definitions: BUILTIN_THOUGHTS,
        meta: { typeId: "thought" }
    })

export { getBuiltinThought, getBuiltinThoughts }
