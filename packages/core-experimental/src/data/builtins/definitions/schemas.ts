import type { ALTEREDSchema } from "../../../models/schemas/definitions"
import { BUILTIN_DATASET_IDS_MAP } from "../ids/datasets"
import { BUILTIN_SCHEMA_IDS_MAP } from "../ids/schemas"
import { BUILTIN_THOUGHT_IDS_MAP } from "../ids/thoughts"

const BUILTIN_SCHEMAS_MAP = {
    INTERFACE_ID: {
        id: BUILTIN_SCHEMA_IDS_MAP.INTERFACE_ID,

        type: "thought",
        required: false,
        value: null,

        thoughtId: BUILTIN_THOUGHT_IDS_MAP.INTERFACE_ID_SCHEMA,
        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.ACTIONS,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS
        ]
    },

    INTERFACE_TYPE: {
        id: BUILTIN_SCHEMA_IDS_MAP.INTERFACE_TYPE,

        type: "text",
        required: true,
        value: null,

        thoughtId: BUILTIN_THOUGHT_IDS_MAP.INTERFACE_TYPE_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.INTERFACES]
    },

    COLLECTION_INTERFACE_ITEM_GROUPS: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS,

        type: "dataset",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES]
    },

    COLLECTION_INTERFACE_ITEM_GROUP_TITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_TITLE,

        type: "text",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_TITLE_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS]
    },

    COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE,

        type: "text",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS]
    },

    COLLECTION_INTERFACE_ITEMS: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEMS,

        type: "dataset",
        required: false,
        value: null,

        thoughtId: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEMS_SCHEMA,
        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS
        ]
    },

    COLLECTION_INTERFACE_ITEM_ICON: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_ICON,

        type: "text",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_ICON_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    },

    COLLECTION_INTERFACE_ITEM_TITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_TITLE,

        type: "text",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_TITLE_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    },

    COLLECTION_INTERFACE_ITEM_SUBTITLE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE,

        type: "text",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    },

    COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE: {
        id: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE,

        type: "text",
        required: false,
        value: null,

        thoughtId:
            BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE_SCHEMA,
        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS]
    }
} as const satisfies Record<string, ALTEREDSchema>

const BUILTIN_SCHEMAS = Object.values(BUILTIN_SCHEMAS_MAP)

export { BUILTIN_SCHEMAS, BUILTIN_SCHEMAS_MAP }
