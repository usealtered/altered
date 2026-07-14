import type { ALTEREDDataset } from "../../../models/datasets/definitions"
import { BUILTIN_DATASETS } from "../definitions/datasets"
import { createBuiltinDataGetter } from "./generic"

const { getMany: getBuiltinDatasets, getOne: getBuiltinDataset } =
    createBuiltinDataGetter<ALTEREDDataset>({
        definitions: BUILTIN_DATASETS,
        meta: { typeId: "dataset" }
    })

export { getBuiltinDataset, getBuiltinDatasets }
