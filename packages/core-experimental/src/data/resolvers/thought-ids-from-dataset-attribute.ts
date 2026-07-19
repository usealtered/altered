import type { ALTEREDAttribute } from "../../models/attributes/definitions"
import type { ALTEREDDatasetID } from "../../models/datasets/definitions"
import type { ALTEREDThoughtID } from "../../models/thoughts/definitions"
import { BUILTIN_DATASETS_MAP } from "../builtins/definitions/datasets"
import { BUILTIN_SCHEMAS } from "../builtins/definitions/schemas"

/**
 * Resolves dataset thought IDs from an attribute of type 'dataset'.
 *
 * @todo P1: Support `$self.id` sentinels (or similar) once self-reference parsing exists.
 */
function resolveThoughtIdsFromDatasetAttribute(
    attribute: ALTEREDAttribute | null
): ALTEREDThoughtID[] | null {
    if (!attribute) return []

    //  @todo P3: Should we throw here?

    const attributeSchema = BUILTIN_SCHEMAS.find(
        schema => schema.id === attribute.schemaId
    )
    if (!attributeSchema) return []

    //  @todo P3: Investigate if we should actually throw here.

    if (attributeSchema.type !== "dataset")
        throw new Error(
            "Dataset Attribute to Thought ID Resolution Failed: Attribute schema is not of type 'dataset'.",
            { cause: { attribute, attributeSchema } }
        )

    const datasetId = attribute.value as ALTEREDDatasetID

    const dataset = Object.values(BUILTIN_DATASETS_MAP).find(
        item => item.id === datasetId
    )
    if (!dataset) {
        //  Or is this the better approach? Consider how Effect would be used.

        console.error(
            "Dataset Attribute to Thought ID Resolution Failed: Dataset not found.",
            { cause: { attribute, datasetId } }
        )

        return []
    }

    return dataset.thoughtIds
}

export { resolveThoughtIdsFromDatasetAttribute }
