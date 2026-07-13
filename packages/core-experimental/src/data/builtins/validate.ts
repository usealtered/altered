import { BUILTIN_ATTRIBUTES } from "./definitions/attributes"
import { BUILTIN_DATASETS } from "./definitions/datasets"
import { BUILTIN_SCHEMAS } from "./definitions/schemas"
import { BUILTIN_THOUGHTS } from "./definitions/thoughts"
import { BUILTIN_ATTRIBUTE_RELATIONS } from "./relations/attributes"
import { BUILTIN_DATASET_RELATIONS } from "./relations/datasets"
import { BUILTIN_SCHEMA_RELATIONS } from "./relations/schemas"
import { BUILTIN_THOUGHT_RELATIONS } from "./relations/thoughts"

/**
 * @todo P1: Complete this utility to validate the builtin data using a script at build time:
 *
 * - Ensure all relations to related primitives are bidirectional, and that required ones exist.
 * - Verify all IDs are unique and meet an ID spec.
 * - Validate non-relation-specific properties, such as `associatedId` and discriminated union variants.
 * - For "required" schemas on a dataset, flag thoughts missing those attributes as incomplete.
 * - For `type: "thought"` / `type: "dataset"` attribute values, ensure the referenced ID exists.
 * - Prune for redundant definitions, correct misaligned naming, optimize attribute structures, etc.
 * - Use AI to explore further validation opportunities.
 *
 * @todo P2: Review manually using the ALTERED thought viewer.
 */
function validateBuiltins(): void {
    const _datasets = BUILTIN_DATASETS
    const _datasetRelations = BUILTIN_DATASET_RELATIONS

    const _schemas = BUILTIN_SCHEMAS
    const _schemaRelations = BUILTIN_SCHEMA_RELATIONS

    const _thoughts = BUILTIN_THOUGHTS
    const _thoughtAttributes = BUILTIN_THOUGHT_RELATIONS

    const _attributes = BUILTIN_ATTRIBUTES
    const _attributeRelations = BUILTIN_ATTRIBUTE_RELATIONS
}

export { validateBuiltins }
