import type { Brand } from "../../typescript/brand"
import type { ALTEREDSchemaID } from "../schemas/definitions"
import type { ALTEREDThoughtID } from "../thoughts/definitions"

type ALTEREDDatasetID = Brand<string, "@altered:datasets:id">

type ALTEREDDatasetDefinition = {
    id: ALTEREDDatasetID
}

type ALTEREDDatasetRelations = {
    id: ALTEREDDatasetID
    thoughtId: ALTEREDThoughtID

    schemaIds: ALTEREDSchemaID[]
    thoughtIds: ALTEREDThoughtID[]
}

type ALTEREDDataset = ALTEREDDatasetDefinition & ALTEREDDatasetRelations

export type {
    ALTEREDDataset,
    ALTEREDDatasetDefinition,
    ALTEREDDatasetID,
    ALTEREDDatasetRelations
}
