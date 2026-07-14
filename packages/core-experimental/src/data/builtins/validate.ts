import { BUILTIN_ATTRIBUTES } from "./definitions/attributes"
import { BUILTIN_DATASETS } from "./definitions/datasets"
import { BUILTIN_SCHEMAS } from "./definitions/schemas"
import { BUILTIN_THOUGHTS } from "./definitions/thoughts"

/**
 * @todo P1: Complete this utility to validate the builtin data using a script at build time:
 *
 * - Ensure all relations to related primitives are bidirectional, and that required ones exist.
 * - Verify all IDs are unique and meet an ID spec.
 * - Validate `associatedId` against `kind`.
 * - For `required` schemas on a dataset, flag thoughts missing those attributes as incomplete.
 * - For `type: "thought"` / `type: "dataset"` attribute values, ensure the referenced ID exists.
 * - Prune for redundant definitions, correct misaligned naming, optimize attribute structures, etc.
 * - Use AI to explore further validation opportunities.
 *
 * @todo P2: Review manually using the ALTERED thought viewer.
 *
 * @todo P3: Consider whether to export validated builtins to a SQL seed for Postgres / optional SQLite parity, or to keep in the app layer.
 */
function validateBuiltins(): void {
    const _datasets = BUILTIN_DATASETS
    const _schemas = BUILTIN_SCHEMAS
    const _thoughts = BUILTIN_THOUGHTS
    const _attributes = BUILTIN_ATTRIBUTES
}

export { validateBuiltins }
