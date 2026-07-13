import type {
    ALTEREDBaseThoughtID,
    ALTEREDDatasetThoughtID,
    ALTEREDSchemaThoughtID,
    ALTEREDThoughtDefinition
} from "../../../models/thoughts/definitions"

const BUILTIN_THOUGHTS_MAP = {
    BUILTINS_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "ssusxD0rG3BGzaPYeXetd" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "Builtins Dataset",
        content: "The built-in primitives used to power your ALTERED Brain."
    },

    ACTIONS_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "zp6TpOTEhDsCQgrwSEiS2" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "Actions Dataset",
        content: "A dataset for the actions used to power your ALTERED Brain."
    },

    ALTERED_CORE_ACTIONS_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "Im7fYp382UnMU3KIEqgft9" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "ALTERED Core Actions Dataset",
        content:
            "A dataset for the core actions used to power your ALTERED Brain."
    },

    INTERFACES_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "3yy8vreU5EX6v6_Yl9EJZ" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "Interfaces Dataset",
        content: "[EDIT] The user interfaces used to compose actions."
    },

    ACTION_INTERFACE_ID_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "1PVbbhYZXyRgaXFvieaf2" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Action Interface ID Schema",
        content: "A schema for the interface thought ID linked from an action."
    },

    INTERFACE_TYPE_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "U6XSN6sc0AZMJ8NQQ-7Ps" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Interface Type Schema",
        content: "A schema for the type of an interface."
    },

    COLLECTION_INTERFACES_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "XUeeIEQ3vCRJJryxgmxRt" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "Collection Interfaces Dataset",
        content: "A dataset for collection interfaces."
    },

    COLLECTION_INTERFACE_ITEM_GROUPS_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "pUL-hyAGy3exrssXJ4LIY" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "Collection Interface Item Groups Dataset",
        content: "A dataset for the item groups of a collection interface."
    },

    COLLECTION_INTERFACE_ITEMS_DATASET_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "72n2XOv4UkH3wovYbdAEW" as ALTEREDDatasetThoughtID,

        kind: "dataset",

        alias: "Collection Interface Items Dataset",
        content: "A dataset for the items of a collection interface."
    },

    COLLECTION_INTERFACE_ITEM_GROUPS_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "YEiGohu-dWrTALBACxGcD" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Groups Schema",
        content: "A schema for the groups of a collection interface."
    },

    COLLECTION_INTERFACE_ITEM_GROUP_TITLE_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "6NQ9EV6U2g4x9_MZTznzl" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Group Title Schema",
        content: "A schema for the title of a collection interface group."
    },

    COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "tJ0E0p0reKMAucuOjGTsr" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Group Subtitle Schema",
        content: "A schema for the subtitle of a collection interface group."
    },

    COLLECTION_INTERFACE_ITEMS_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "69r74zjndxWIzemrvbU4-" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Items Schema",
        content: "A schema for the items of a collection interface."
    },

    COLLECTION_INTERFACE_ITEM_ICON_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "t8EbknR9YaxoNDzODAR0S" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Icon Schema",
        content: "The schema for the icon of a collection interface item."
    },

    COLLECTION_INTERFACE_ITEM_TITLE_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "5YQYNXWE1488R_bf257sd" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Title Schema",
        content: "The schema for the title of a collection interface item."
    },

    COLLECTION_INTERFACE_ITEM_SUBTITLE_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "JifubTsRuCvOu-PRvm8rV" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Subtitle Schema",
        content: "A schema for the subtitle of a collection interface item."
    },

    COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE_SCHEMA_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "R8mlfIFfEK04gkfWrOaxK" as ALTEREDSchemaThoughtID,

        kind: "schema",

        alias: "Collection Interface Item Trigger Phrase Schema",
        content:
            "A schema for the trigger phrase of a collection interface item."
    },

    ACTION_PALETTE_INTERFACE_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "uRmUysH0Nn0la3mgGm7DK" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Action Palette Interface",
        content: "[EDIT] An interface for using your ALTERED systems."
    },

    ACTION_PALETTE_CORE_INTERFACE_GROUP_THOUGHT: {
        id: "OG_MW3XpLWl0qYbH2ar4O" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Action Palette Core Interface Group",
        content:
            "The interface group that contains the core ALTERED functions for working with your thoughts."
    },

    CAPTURE_THOUGHT_ACTION_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "yM3HR3M_oqqiYtnAVsUSz" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Capture Thought Action",
        content: "An action for capturing a thought to your ALTERED Brain."
    },

    CAPTURE_THOUGHT_INTERFACE_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "kRQG-b4XJ4KhXQ2oJH240" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Capture Thought Interface",
        content: "An interface for capturing a thought to your ALTERED Brain."
    },

    SET_UP_SHORTCUTS_ACTION_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "5swzvnuISqUWySg2WWvZ3" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Set Up Shortcuts Action",
        content:
            "An action for configuring Raycast Script Commands for ALTERED shortcuts."
    },

    SET_UP_SHORTCUTS_INTERFACE_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "WYIYw5MCIDsMa7gyXlzN0" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Set Up Shortcuts Interface",
        content:
            "An interface for configuring Raycast Script Commands for ALTERED shortcuts."
    },

    ALTERED_ONBOARDING_ACTION_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "sGCsweuj2RCnTGqCpt0hQ" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "ALTERED Onboarding Action",
        content:
            "An action for learning how to set up and use your ALTERED Brain."
    },

    ALTERED_ONBOARDING_INTERFACE_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "YHpqBUyjK1gcFbZGL8e2t" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "ALTERED Onboarding Interface",
        content:
            "An interface for learning how to set up and use your ALTERED Brain."
    },

    VIEW_THOUGHTS_ACTION_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "QiqKmej3R82_WmJMlJRSu" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "View Thoughts Action",
        content:
            "An action for viewing and managing the thoughts in your ALTERED Brain."
    },

    VIEW_THOUGHTS_INTERFACE_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "VTXccgqn1at_Flza5Kdr2" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "View Thoughts Interface",
        content:
            "An interface for viewing and managing the thoughts in your ALTERED Brain."
    },

    DISTILL_MESSAGE_TOOL_POC_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "Zg4RIXPeVUf6Mmt6mcZnk" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Distill Message Tool POC",
        content:
            "# Distill Message Tool POC\n\nWe should implement a basic message distillation tool that allows our chat agent to ingest user messages to their ALTERED brain."
    },

    QUERY_MEMORY_TOOL_POC_THOUGHT: {
        // @spell-checker: disable-next-line
        id: "Mo7b7yv0uf3GQONLTSoQY" as ALTEREDBaseThoughtID,

        kind: null,

        alias: "Query Memory Tool POC",
        content:
            "# Query Memory Tool POC\n\nWe should implement a basic memory querying tool that allows our chat agent to fetch thoughts from the user's ALTERED brain for context about a specific topic, scope, or intent."
    }
} as const satisfies Record<string, ALTEREDThoughtDefinition>

const BUILTIN_THOUGHTS = Object.values(BUILTIN_THOUGHTS_MAP)

export { BUILTIN_THOUGHTS, BUILTIN_THOUGHTS_MAP }
