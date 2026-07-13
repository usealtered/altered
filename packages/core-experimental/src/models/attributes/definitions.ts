import type { Brand } from "../../typescript/brand"
import type { ALTEREDSchemaID } from "../schemas/definitions"
import type { ALTEREDThoughtID } from "../thoughts/definitions"

type ALTEREDAttributeID = Brand<string, "@altered/attributes/id">

type ALTEREDAttribute = {
    id: ALTEREDAttributeID
    thoughtId: ALTEREDThoughtID

    value: string

    schemaId: ALTEREDSchemaID
}

export type { ALTEREDAttribute, ALTEREDAttributeID }
