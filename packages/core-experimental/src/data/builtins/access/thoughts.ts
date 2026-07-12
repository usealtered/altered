import type {
    ALTEREDThought,
    ALTEREDThoughtDefinition,
    ALTEREDThoughtRelations
} from "../../../models/thoughts/definitions"
import { BUILTIN_THOUGHTS } from "../definitions/thoughts"
import { BUILTIN_THOUGHT_RELATIONS } from "../relations/thoughts"
import { createBuiltinDataGetter } from "./generic"

const { getMany: getBuiltinThoughts, getOne: getBuiltinThought } =
    createBuiltinDataGetter<
        ALTEREDThoughtDefinition,
        ALTEREDThoughtRelations,
        ALTEREDThought
    >({
        definitions: BUILTIN_THOUGHTS,
        relations: BUILTIN_THOUGHT_RELATIONS,
        meta: { typeId: "thought" }
    })

export { getBuiltinThought, getBuiltinThoughts }
