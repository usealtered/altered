import type { ALTEREDAttribute } from "../../../models/attributes/definitions"
import { BUILTIN_ATTRIBUTES } from "../definitions/attributes"
import { createBuiltinDataGetter } from "./generic"

const { getOne: getBuiltinAttribute, getMany: getBuiltinAttributes } =
    createBuiltinDataGetter<ALTEREDAttribute>({
        definitions: BUILTIN_ATTRIBUTES,
        meta: { typeId: "attribute" }
    })

export { getBuiltinAttribute, getBuiltinAttributes }
