import type { Brand } from "../../typescript/brand"
import type { ALTEREDSchemaID } from "../schemas/definitions"
import type { ALTEREDThoughtID } from "../thoughts/definitions"

type ALTEREDDatasetID = Brand<string, "@altered/datasets/id">

type ALTEREDDataset = {
    id: ALTEREDDatasetID
    thoughtId: ALTEREDThoughtID

    schemaIds: ALTEREDSchemaID[]
    thoughtIds: ALTEREDThoughtID[]
}

export type { ALTEREDDataset, ALTEREDDatasetID }
