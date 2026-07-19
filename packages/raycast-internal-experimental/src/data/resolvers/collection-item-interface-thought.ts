import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import { BUILTIN_DATASETS_MAP } from "@altered/core-experimental/data/builtins/definitions/datasets"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import type {
    ALTEREDThought,
    ALTEREDThoughtID
} from "@altered/core-experimental/models/thoughts/definitions"

/**
 * Resolves an Interface Thought from a Collection Interface Item Thought.
 *
 * @remarks This should be the optimal signature style for resolvers. Nullable input (can accept a union of options properties for different source types), and a whole output if the results are fetched in the process.
 */
function resolveCollectionItemInterfaceThought(
    options:
        | {
              collectionItemThought: ALTEREDThought | null
          }
        | {
              collectionItemThoughtId: ALTEREDThoughtID | null
          }
): ALTEREDThought | null {
    let collectionItemThought: ALTEREDThought | undefined

    if ("collectionItemThought" in options) {
        const thought = options.collectionItemThought

        if (!thought) {
            console.warn(
                "Collection Item Interface Thought Resolution Failed: No collection item thought was provided.",
                { collectionItemThought: options.collectionItemThought }
            )

            return null
        }

        collectionItemThought = thought
    } else if ("collectionItemThoughtId" in options) {
        const thought = getBuiltinThought({
            query: { id: options.collectionItemThoughtId }
        })

        if (!thought) {
            console.warn(
                "Collection Item Interface Thought Resolution Failed: No thought was found for the provided collection item thought ID.",
                { collectionItemThoughtId: options.collectionItemThoughtId }
            )

            return null
        }

        collectionItemThought = thought
    } else {
        return null
    }

    if (
        !collectionItemThought.datasetIds.includes(
            BUILTIN_DATASETS_MAP.COLLECTION_INTERFACE_ITEMS.id
        )
    ) {
        console.warn(
            "Collection Item Interface Thought Resolution Failed: The collection item thought is not in the 'Collection Interface Items' dataset.",
            { collectionItemThought }
        )

        return null
    }

    const collectionItemAttributes = getBuiltinAttributes({
        query: { ids: collectionItemThought.attributeIds }
    })

    if (!collectionItemAttributes) {
        console.warn(
            "Collection Item Interface Thought Resolution Failed: No attributes were found for the collection item thought.",
            { collectionItemThought }
        )

        return null
    }

    const collectionItemInterfaceIdAttribute = collectionItemAttributes.find(
        attribute => attribute.schemaId === BUILTIN_SCHEMAS_MAP.INTERFACE_ID.id
    )

    if (
        collectionItemInterfaceIdAttribute &&
        collectionItemInterfaceIdAttribute.value
    ) {
        const collectionItemInterfaceThought = getBuiltinThought({
            query: {
                id: collectionItemInterfaceIdAttribute.value as ALTEREDThoughtID
            }
        })

        if (!collectionItemInterfaceThought) {
            console.warn(
                "Collection Item Interface Thought Resolution Failed: The interface for the collection item thought does not exist.",
                { collectionItemThought }
            )

            return null
        }

        return collectionItemInterfaceThought
    }

    if (
        collectionItemThought.datasetIds.includes(
            BUILTIN_DATASETS_MAP.INTERFACES.id
        )
    ) {
        console.info(
            "Collection Item Interface Thought Resolution: No Interface ID attribute was found for the collection item thought. Defaulting to the collection item thought's own ID, as it is an interface.",
            { collectionItemThought }
        )

        return collectionItemThought
    }

    console.warn(
        "Collection Item Interface Thought Resolution Failed: No resolvable interface was found for the collection item thought.",
        { collectionItemThought }
    )

    return null
}

export { resolveCollectionItemInterfaceThought }
