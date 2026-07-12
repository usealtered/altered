import type {
    ALTEREDAttribute,
    ALTEREDAttributeDefinition,
    ALTEREDAttributeRelations
} from "../../../models/attributes/definitions"
import { BUILTIN_ATTRIBUTES } from "../definitions/attributes"
import { BUILTIN_ATTRIBUTE_RELATIONS } from "../relations/attributes"
import { createBuiltinDataGetter } from "./generic"

const { getOne: getBuiltinAttribute, getMany: getBuiltinAttributes } =
    createBuiltinDataGetter<
        ALTEREDAttributeDefinition,
        ALTEREDAttributeRelations,
        ALTEREDAttribute
    >({
        definitions: BUILTIN_ATTRIBUTES,
        relations: BUILTIN_ATTRIBUTE_RELATIONS,
        meta: { typeId: "attribute" }
    })

export { getBuiltinAttribute, getBuiltinAttributes }
