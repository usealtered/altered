import type { Brand } from "../../typescript/brand"
import type { ALTEREDAttributeID } from "../attributes/definitions"
import type { ALTEREDDatasetID } from "../datasets/definitions"
import type { ALTEREDSchemaID } from "../schemas/definitions"

type ALTEREDThoughtID = Brand<string, "@altered:thoughts:id">

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
    alias: string
    content: string

    datasetIds: ALTEREDDatasetID[]
    attributeIds: ALTEREDAttributeID[]
}

type ALTEREDCoreThought = ALTEREDThoughtBase & {
    id: ALTEREDThoughtID
    kind: null
    associatedId: null
}

type ALTEREDDatasetThought = ALTEREDThoughtBase & {
    id: ALTEREDThoughtID
    kind: "dataset"
    associatedId: ALTEREDDatasetID
}

type ALTEREDSchemaThought = ALTEREDThoughtBase & {
    id: ALTEREDThoughtID
    kind: "schema"
    associatedId: ALTEREDSchemaID
}

type ALTEREDAttributeThought = ALTEREDThoughtBase & {
    id: ALTEREDThoughtID
    kind: "attribute"
    associatedId: ALTEREDAttributeID
}

type ALTEREDThought =
    | ALTEREDCoreThought
    | ALTEREDDatasetThought
    | ALTEREDSchemaThought
    | ALTEREDAttributeThought

/**
 * Authoring split for builtins (definition without relation edges).
 *
 * @remarks Kept separate from relations to avoid circular imports while
 * defining built-in graphs. Prefer merging into full thought objects once IDs
 * are hoisted.
 *
 * @todo P1: Hoist builtin IDs, then author full `ALTEREDThought` objects (or
 * merge definition + relations at the module boundary).
 */
type ALTEREDThoughtDefinition =
    | {
          id: ALTEREDThoughtID
          kind: null
          alias: string
          content: string
      }
    | {
          id: ALTEREDThoughtID
          kind: "dataset"
          alias: string
          content: string
      }
    | {
          id: ALTEREDThoughtID
          kind: "schema"
          alias: string
          content: string
      }
    | {
          id: ALTEREDThoughtID
          kind: "attribute"
          alias: string
          content: string
      }

/**
 * Authoring split for builtins (relation edges without core fields).
 *
 * @remarks `kind` is repeated so `associatedId` stays correctly discriminated
 * without per-kind ID brands.
 */
type ALTEREDThoughtRelations =
    | {
          id: ALTEREDThoughtID
          kind: null
          associatedId: null
          datasetIds: ALTEREDDatasetID[]
          attributeIds: ALTEREDAttributeID[]
      }
    | {
          id: ALTEREDThoughtID
          kind: "dataset"
          associatedId: ALTEREDDatasetID
          datasetIds: ALTEREDDatasetID[]
          attributeIds: ALTEREDAttributeID[]
      }
    | {
          id: ALTEREDThoughtID
          kind: "schema"
          associatedId: ALTEREDSchemaID
          datasetIds: ALTEREDDatasetID[]
          attributeIds: ALTEREDAttributeID[]
      }
    | {
          id: ALTEREDThoughtID
          kind: "attribute"
          associatedId: ALTEREDAttributeID
          datasetIds: ALTEREDDatasetID[]
          attributeIds: ALTEREDAttributeID[]
      }

export type {
    ALTEREDAttributeThought,
    ALTEREDCoreThought,
    ALTEREDDatasetThought,
    ALTEREDSchemaThought,
    ALTEREDThought,
    ALTEREDThoughtDefinition,
    ALTEREDThoughtID,
    ALTEREDThoughtKindID,
    ALTEREDThoughtRelations
}
