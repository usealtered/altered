import type { ALTEREDSchema } from "../../../models/schemas/definitions"
import { BUILTIN_DATASET_IDS_MAP } from "../ids/datasets"
import { BUILTIN_SCHEMA_IDS_MAP } from "../ids/schemas"
import { BUILTIN_THOUGHT_IDS_MAP } from "../ids/thoughts"

const BUILTIN_SCHEMAS_MAP = {
    INTERFACE_ID: {
        id: BUILTIN_SCHEMA_IDS_MAP.INTERFACE_ID,
        thoughtId: BUILTIN_THOUGHT_IDS_MAP.INTERFACE_ID_SCHEMA,

        type: "thought",
        required: false,
        value: null,

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.ACTIONS,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS
        ]
    },

    INTERFACE_TYPE: {
        id: BUILTIN_SCHEMA_IDS_MAP.INTERFACE_TYPE,
        thoughtId: BUILTIN_THOUGHT_IDS_MAP.INTERFACE_TYPE_SCHEMA,

        type: "text",
        required: true,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.INTERFACES]
    },

    COLLECTION_INTERFACE_ITEM_GROUPS: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS_SCHEMA,

        type: "dataset",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES]
    },

    COLLECTION_INTERFACE_ITEM_GROUP_TITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_TITLE,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_TITLE_SCHEMA,

        type: "text",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS]
    },

    COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE_SCHEMA,

        type: "text",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS]
    },

    COLLECTION_INTERFACE_ITEMS: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
        thoughtId: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEMS_SCHEMA,

        type: "dataset",
        required: false,
        value: null,

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS
        ]
    },

    COLLECTION_INTERFACE_ITEM_ICON: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_ICON,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_ICON_SCHEMA,

        type: "text",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    },

    COLLECTION_INTERFACE_ITEM_TITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_TITLE,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_TITLE_SCHEMA,

        type: "text",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    },

    COLLECTION_INTERFACE_ITEM_SUBTITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE_SCHEMA,

        type: "text",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    },

    COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE,
        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE_SCHEMA,

        type: "text",
        required: false,
        value: null,

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    }
} as const satisfies Record<keyof typeof BUILTIN_SCHEMA_IDS_MAP, ALTEREDSchema>

const BUILTIN_SCHEMAS = Object.values(BUILTIN_SCHEMAS_MAP)

export { BUILTIN_SCHEMAS, BUILTIN_SCHEMAS_MAP }
