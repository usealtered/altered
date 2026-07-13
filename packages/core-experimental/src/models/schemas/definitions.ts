import type { Brand } from "../../typescript/brand"
import type { KebabToSnakeCase } from "../../typescript/case-transformations"
import type { ALTEREDDatasetID } from "../datasets/definitions"
import type { ALTEREDThoughtID } from "../thoughts/definitions"

type ALTEREDSchemaID = Brand<string, "@altered:schemas:id">

const ALTERED_SCHEMA_TYPE_IDS = [
    "text",
    "thought",
    "dataset",
    "custom"
] as const
type ALTEREDSchemaTypeID = (typeof ALTERED_SCHEMA_TYPE_IDS)[number]

const ALTERED_SCHEMA_TYPE_ID_MAP = {
    TEXT: "text",
    THOUGHT: "thought",
    DATASET: "dataset",
    CUSTOM: "custom"
} as const satisfies Record<
    Uppercase<KebabToSnakeCase<ALTEREDSchemaTypeID>>,
    ALTEREDSchemaTypeID
>

type ALTEREDSchemaDefinition = {
    id: ALTEREDSchemaID

    type: ALTEREDSchemaTypeID

    /**
     * When true, thoughts in datasets that use this schema must expose a
     * matching attribute or be treated as incomplete.
     *
     * @remarks Defaults to true for strict control. Absence of an attribute
     * (not a null attribute value) represents "unset."
     */
    required: boolean

    /**
     * Schema configuration payload.
     *
     * @remarks Empty for `text` / `thought` / `dataset`. For `custom`, a
     * serialized ArkType / JSON Schema string. Null when unused.
     */
    value: string | null
}

type ALTEREDSchemaRelations = {
    id: ALTEREDSchemaID
    thoughtId: ALTEREDThoughtID

    datasetIds: ALTEREDDatasetID[]
}

type ALTEREDSchema = ALTEREDSchemaDefinition & ALTEREDSchemaRelations

export {
    ALTERED_SCHEMA_TYPE_ID_MAP,
    ALTERED_SCHEMA_TYPE_IDS,
    type ALTEREDSchema,
    type ALTEREDSchemaDefinition,
    type ALTEREDSchemaID,
    type ALTEREDSchemaRelations,
    type ALTEREDSchemaTypeID
}
