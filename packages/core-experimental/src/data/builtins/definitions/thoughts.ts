import type { ALTEREDThought } from "../../../models/thoughts/definitions"
import { BUILTIN_ATTRIBUTE_IDS_MAP } from "../ids/attributes"
import { BUILTIN_DATASET_IDS_MAP } from "../ids/datasets"
import { BUILTIN_SCHEMA_IDS_MAP } from "../ids/schemas"
import { BUILTIN_THOUGHT_IDS_MAP } from "../ids/thoughts"

const BUILTIN_THOUGHTS_MAP = {
    BUILTINS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.BUILTINS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.BUILTINS,

        alias: "Builtins",
        content: "The built-in primitives used to power your ALTERED Brain.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    ACTIONS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.ACTIONS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.ACTIONS,

        alias: "Actions",
        content: "Actions that appear in the Action Palette.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    ALTERED_CORE_ACTIONS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.ALTERED_CORE_ACTIONS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.ALTERED_CORE_ACTIONS,

        alias: "ALTERED Core Actions",
        content: "Core actions for working with your ALTERED Brain.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    INTERFACES_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.INTERFACES_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.INTERFACES,

        alias: "Interfaces",
        content: "User interfaces used to compose ALTERED experiences.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACES_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACES_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES,

        alias: "Collection Interfaces",
        content: "Interfaces rendered as collections of items.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEMS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEMS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,

        alias: "Collection Interface Items",
        content: "Rows that can appear inside a collection interface.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_GROUPS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS,

        alias: "Collection Interface Item Groups",
        content: "Groups of items inside a collection interface.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    ACTION_PALETTE_ITEMS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.ACTION_PALETTE_ITEMS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.ACTION_PALETTE_ITEMS,

        alias: "Action Palette Items",
        content: "Root Action Palette collection items.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    ACTION_PALETTE_GROUPS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.ACTION_PALETTE_GROUPS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.ACTION_PALETTE_GROUPS,

        alias: "Action Palette Groups",
        content: "Root Action Palette collection groups.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    VIEW_THOUGHTS_ITEMS_DATASET: {
        id: BUILTIN_THOUGHT_IDS_MAP.VIEW_THOUGHTS_ITEMS_DATASET,
        kind: "dataset",
        associatedId: BUILTIN_DATASET_IDS_MAP.VIEW_THOUGHTS_ITEMS,

        alias: "View Thoughts Items",
        content: "Items shown in the View Thoughts collection.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    INTERFACE_ID_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.INTERFACE_ID_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.INTERFACE_ID,

        alias: "Interface ID",
        content: "Links a row or action to an interface thought.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    INTERFACE_TYPE_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.INTERFACE_TYPE_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.INTERFACE_TYPE,

        alias: "Interface Type",
        content: "The render type of an interface.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_GROUPS_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS,

        alias: "Collection Interface Item Groups",
        content: "Dataset of groups for a collection interface.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_GROUP_TITLE_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_TITLE_SCHEMA,
        kind: "schema",
        associatedId:
            BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_TITLE,

        alias: "Collection Interface Item Group Title",
        content: "Title for a collection interface group.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE_SCHEMA,
        kind: "schema",
        associatedId:
            BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE,

        alias: "Collection Interface Item Group Subtitle",
        content: "Subtitle for a collection interface group.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEMS_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEMS_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEMS,

        alias: "Collection Interface Items",
        content: "Dataset of items for a collection interface.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_ICON_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_ICON_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_ICON,

        alias: "Collection Interface Item Icon",
        content: "Icon for a collection interface item.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_TITLE_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_TITLE_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_TITLE,

        alias: "Collection Interface Item Title",
        content: "Title for a collection interface item.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_SUBTITLE_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE_SCHEMA,
        kind: "schema",
        associatedId: BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_SUBTITLE,

        alias: "Collection Interface Item Subtitle",
        content: "Subtitle for a collection interface item.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE_SCHEMA: {
        id: BUILTIN_THOUGHT_IDS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE_SCHEMA,
        kind: "schema",
        associatedId:
            BUILTIN_SCHEMA_IDS_MAP.COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE,

        alias: "Collection Interface Item Trigger Phrase",
        content: "Trigger phrase for a collection interface item.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.BUILTINS],
        attributeIds: []
    },

    ACTION_PALETTE: {
        id: BUILTIN_THOUGHT_IDS_MAP.ACTION_PALETTE,
        kind: null,
        associatedId: null,

        alias: "Action Palette",
        content: "An interface for using your ALTERED systems.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.BUILTINS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.ACTION_PALETTE_INTERFACE_TYPE,
            BUILTIN_ATTRIBUTE_IDS_MAP.ACTION_PALETTE_ITEMS,
            BUILTIN_ATTRIBUTE_IDS_MAP.ACTION_PALETTE_GROUPS
        ]
    },

    ACTION_PALETTE_CORE_GROUP: {
        id: BUILTIN_THOUGHT_IDS_MAP.ACTION_PALETTE_CORE_GROUP,
        kind: null,
        associatedId: null,

        alias: "ALTERED Core",
        content:
            "The interface group that contains the core ALTERED functions for working with your thoughts.",

        datasetIds: [BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.ACTION_PALETTE_CORE_GROUP_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.ACTION_PALETTE_CORE_GROUP_SUBTITLE
        ]
    },

    CAPTURE_THOUGHT: {
        id: BUILTIN_THOUGHT_IDS_MAP.CAPTURE_THOUGHT,
        kind: null,
        associatedId: null,

        alias: "Capture Thought",
        content:
            "A way to capture a thought to your ALTERED brain using the Raycast extension.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.ACTIONS,
            BUILTIN_DATASET_IDS_MAP.ALTERED_CORE_ACTIONS,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.CAPTURE_THOUGHT_ICON,
            BUILTIN_ATTRIBUTE_IDS_MAP.CAPTURE_THOUGHT_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.CAPTURE_THOUGHT_SUBTITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.CAPTURE_THOUGHT_TRIGGER_PHRASE,
            BUILTIN_ATTRIBUTE_IDS_MAP.CAPTURE_THOUGHT_INTERFACE_TYPE
        ]
    },

    SET_UP_SHORTCUTS: {
        id: BUILTIN_THOUGHT_IDS_MAP.SET_UP_SHORTCUTS,
        kind: null,
        associatedId: null,

        alias: "Set Up Shortcuts",
        content: "Configure Raycast Script Commands for ALTERED shortcuts.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.ACTIONS,
            BUILTIN_DATASET_IDS_MAP.ALTERED_CORE_ACTIONS,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.SET_UP_SHORTCUTS_ICON,
            BUILTIN_ATTRIBUTE_IDS_MAP.SET_UP_SHORTCUTS_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.SET_UP_SHORTCUTS_SUBTITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.SET_UP_SHORTCUTS_INTERFACE_TYPE
        ]
    },

    ALTERED_ONBOARDING: {
        id: BUILTIN_THOUGHT_IDS_MAP.ALTERED_ONBOARDING,
        kind: null,
        associatedId: null,

        alias: "ALTERED Onboarding",
        content: "Learn how to set up and use your ALTERED Brain.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.ACTIONS,
            BUILTIN_DATASET_IDS_MAP.ALTERED_CORE_ACTIONS,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.ALTERED_ONBOARDING_ICON,
            BUILTIN_ATTRIBUTE_IDS_MAP.ALTERED_ONBOARDING_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.ALTERED_ONBOARDING_SUBTITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.ALTERED_ONBOARDING_INTERFACE_TYPE
        ]
    },

    VIEW_THOUGHTS: {
        id: BUILTIN_THOUGHT_IDS_MAP.VIEW_THOUGHTS,
        kind: null,
        associatedId: null,

        alias: "View Thoughts",
        content: "View and manage the thoughts in your ALTERED Brain.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.ACTIONS,
            BUILTIN_DATASET_IDS_MAP.ALTERED_CORE_ACTIONS,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES,
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.VIEW_THOUGHTS_ICON,
            BUILTIN_ATTRIBUTE_IDS_MAP.VIEW_THOUGHTS_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.VIEW_THOUGHTS_SUBTITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.VIEW_THOUGHTS_TRIGGER_PHRASE,
            BUILTIN_ATTRIBUTE_IDS_MAP.VIEW_THOUGHTS_INTERFACE_TYPE,
            BUILTIN_ATTRIBUTE_IDS_MAP.VIEW_THOUGHTS_ITEMS
        ]
    },

    DISTILL_MESSAGE_TOOL_POC: {
        id: BUILTIN_THOUGHT_IDS_MAP.DISTILL_MESSAGE_TOOL_POC,
        kind: null,
        associatedId: null,

        alias: "Distill Message Tool POC",
        content:
            "# Distill Message Tool POC\n\nWe should implement a basic message distillation tool that allows our chat agent to ingest user messages to their ALTERED brain.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.DISTILL_MESSAGE_TOOL_POC_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.DISTILL_MESSAGE_TOOL_POC_SUBTITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.DISTILL_MESSAGE_TOOL_POC_INTERFACE_TYPE
        ]
    },

    QUERY_MEMORY_TOOL_POC: {
        id: BUILTIN_THOUGHT_IDS_MAP.QUERY_MEMORY_TOOL_POC,
        kind: null,
        associatedId: null,

        alias: "Query Memory Tool POC",
        content:
            "# Query Memory Tool POC\n\nWe should implement a basic memory querying tool that allows our chat agent to fetch thoughts from the user's ALTERED brain for context about a specific topic, scope, or intent.",

        datasetIds: [
            BUILTIN_DATASET_IDS_MAP.COLLECTION_INTERFACE_ITEMS,
            BUILTIN_DATASET_IDS_MAP.INTERFACES
        ],
        attributeIds: [
            BUILTIN_ATTRIBUTE_IDS_MAP.QUERY_MEMORY_TOOL_POC_TITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.QUERY_MEMORY_TOOL_POC_SUBTITLE,
            BUILTIN_ATTRIBUTE_IDS_MAP.QUERY_MEMORY_TOOL_POC_INTERFACE_TYPE
        ]
    }
} as const satisfies Record<
    keyof typeof BUILTIN_THOUGHT_IDS_MAP,
    ALTEREDThought
>

const BUILTIN_THOUGHTS = Object.values(BUILTIN_THOUGHTS_MAP)

export { BUILTIN_THOUGHTS, BUILTIN_THOUGHTS_MAP }
