import type {
    ALTEREDDatasetDefinition,
    ALTEREDDatasetID
} from "../../../models/datasets/definitions"

const BUILTIN_DATASETS_MAP = {
    BUILTINS_DATASET: {
        // @spell-checker: disable-next-line
        id: "YD5mp3rjpomObHUSw_jmE" as ALTEREDDatasetID
    },

    ACTIONS_DATASET: {
        // @spell-checker: disable-next-line
        id: "4PIqHGzkkTMrn4uRZyOmh" as ALTEREDDatasetID
    },

    ALTERED_CORE_ACTIONS_DATASET: {
        // @spell-checker: disable-next-line
        id: "m7fYp382UnMU3KIEqgft9" as ALTEREDDatasetID
    },

    INTERFACES_DATASET: {
        // @spell-checker: disable-next-line
        id: "B9PpoW7On9KK-_4KUDDgg" as ALTEREDDatasetID
    },

    COLLECTION_INTERFACES_DATASET: {
        // @spell-checker: disable-next-line
        id: "L-X_StxqRjZiBh-8Q6jJm" as ALTEREDDatasetID
    },

    COLLECTION_INTERFACE_ITEMS_DATASET: {
        // @spell-checker: disable-next-line
        id: "mu8iXfqA5e_fZ-QGX9b-r" as ALTEREDDatasetID
    },

    COLLECTION_INTERFACE_ITEM_GROUPS_DATASET: {
        // @spell-checker: disable-next-line
        id: "8SuZQFXa4xL18vl6YgYg-" as ALTEREDDatasetID
    }
} as const satisfies Record<string, ALTEREDDatasetDefinition>

const BUILTIN_DATASETS = Object.values(BUILTIN_DATASETS_MAP)

export { BUILTIN_DATASETS, BUILTIN_DATASETS_MAP }
