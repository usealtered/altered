import type { Brand } from "../../typescript/brand"
import type { ALTEREDAttributeID } from "../attributes/definitions"
import type { ALTEREDDatasetID } from "../datasets/definitions"
import type { ALTEREDSchemaID } from "../schemas/definitions"

type ALTEREDThoughtID = Brand<string, "@altered/thoughts/id">

/**
 * Discriminates how `associatedId` is interpreted on a thought.
 *
 * @remarks `brain` is intentionally omitted: brains will be ordinary thoughts
 * in a built-in Brains dataset, interpreted specially in the UI.
 *
 * @todo P2: Add a built-in Brains dataset and implement UI interpretation.
 */
type ALTEREDThoughtKindID = "dataset" | "attribute" | "schema"

type ALTEREDThoughtBase = {
    id: ALTEREDThoughtID

    alias: string
    content: string

    datasetIds: ALTEREDDatasetID[]
    attributeIds: ALTEREDAttributeID[]
}

type ALTEREDCoreThought = ALTEREDThoughtBase & {
    kind: null
    associatedId: null
}

type ALTEREDDatasetThought = ALTEREDThoughtBase & {
    kind: "dataset"
    associatedId: ALTEREDDatasetID
}

type ALTEREDSchemaThought = ALTEREDThoughtBase & {
    kind: "schema"
    associatedId: ALTEREDSchemaID
}

type ALTEREDAttributeThought = ALTEREDThoughtBase & {
    kind: "attribute"
    associatedId: ALTEREDAttributeID
}

type ALTEREDThought =
    | ALTEREDCoreThought
    | ALTEREDDatasetThought
    | ALTEREDSchemaThought
    | ALTEREDAttributeThought

export type {
    ALTEREDAttributeThought,
    ALTEREDCoreThought,
    ALTEREDDatasetThought,
    ALTEREDSchemaThought,
    ALTEREDThought,
    ALTEREDThoughtBase,
    ALTEREDThoughtID,
    ALTEREDThoughtKindID
}
