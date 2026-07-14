import type { ALTEREDSchema } from "../../../models/schemas/definitions"
import { BUILTIN_SCHEMAS } from "../definitions/schemas"
import { createBuiltinDataGetter } from "./generic"

const { getMany: getBuiltinSchemas, getOne: getBuiltinSchema } =
    createBuiltinDataGetter<ALTEREDSchema>({
        definitions: BUILTIN_SCHEMAS,
        meta: { typeId: "schema" }
    })

export { getBuiltinSchema, getBuiltinSchemas }
