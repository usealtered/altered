import type { Brand } from "../../typescript/brand"
import type { ALTEREDSchemaID } from "../schemas/definitions"
import type { ALTEREDThoughtID } from "../thoughts/definitions"

type ALTEREDAttributeID = Brand<string, "@altered:attributes:id">

type ALTEREDAttributeDefinition = {
    id: ALTEREDAttributeID

    value: string
}

type ALTEREDAttributeRelations = {
    id: ALTEREDAttributeID
    thoughtId: ALTEREDThoughtID

    schemaId: ALTEREDSchemaID
}

type ALTEREDAttribute = ALTEREDAttributeDefinition & ALTEREDAttributeRelations

export type {
    ALTEREDAttribute,
    ALTEREDAttributeDefinition,
    ALTEREDAttributeID,
    ALTEREDAttributeRelations
}
