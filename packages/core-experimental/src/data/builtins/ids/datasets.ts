import type { ALTEREDDatasetID } from "../../../models/datasets/definitions"

const BUILTIN_DATASET_IDS = {
    // @spell-checker: disable

    BUILTINS: "YD5mp3rjpomObHUSw_jmE",
    ACTIONS: "4PIqHGzkkTMrn4uRZyOmh",
    ALTERED_CORE_ACTIONS: "m7fYp382UnMU3KIEqgft9",
    INTERFACES: "B9PpoW7On9KK-_4KUDDgg",
    COLLECTION_INTERFACES: "L-X_StxqRjZiBh-8Q6jJm",
    COLLECTION_INTERFACE_ITEMS: "mu8iXfqA5e_fZ-QGX9b-r",
    COLLECTION_INTERFACE_ITEM_GROUPS: "8SuZQFXa4xL18vl6YgYg-",
    ACTION_PALETTE_ITEMS: "MTU7mg20rz9puIbww3p1w",
    ACTION_PALETTE_GROUPS: "TwAdN1jqkZBtRXzaInytu",
    VIEW_THOUGHTS_ITEMS: "OfwPim4_P4W4J7zqqt3RD"

    // @spell-checker: enable
} as const satisfies Record<string, string>

const BUILTIN_DATASET_IDS_MAP = BUILTIN_DATASET_IDS as Record<
    keyof typeof BUILTIN_DATASET_IDS,
    ALTEREDDatasetID
>

export { BUILTIN_DATASET_IDS_MAP }
