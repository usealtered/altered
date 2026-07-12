import type {
    ALTEREDAttributeDefinition,
    ALTEREDAttributeID
} from "../../../models/attributes/definitions"

const BUILTIN_ATTRIBUTES_MAP = {
    ACTION_PALETTE_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "QK0CEnWTvwkkuZIMYpqNB" as ALTEREDAttributeID,

        value: "collection"
    },

    ACTION_PALETTE_INTERFACE_ITEMS_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "9dnnIk2Urp7lKfjZM5-dZ" as ALTEREDAttributeID,

        value: null
    },

    ACTION_PALETTE_INTERFACE_GROUPS_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "C7dPE07LXGhE0XXX5ayso" as ALTEREDAttributeID,

        value: null
    },

    ACTION_PALETTE_CORE_INTERFACE_GROUP_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "_wZuTar2P71nTwdxWk8tH" as ALTEREDAttributeID,

        value: "ALTERED Core"
    },

    ACTION_PALETTE_CORE_INTERFACE_GROUP_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "QvW9i3nbWmfpWeJpMcjc7" as ALTEREDAttributeID,

        value: "Manage your Brain"
    },

    CAPTURE_THOUGHT_ACTION_ICON_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "2Sdn_7My3C4OBawP-qj_x" as ALTEREDAttributeID,

        value: "icon-16"
    },

    CAPTURE_THOUGHT_ACTION_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "-OAd_w54UjEGGlkCQEwxu" as ALTEREDAttributeID,

        value: "Capture Thought"
    },

    CAPTURE_THOUGHT_ACTION_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "KBPRDUk0yBMDGqX_irgwW" as ALTEREDAttributeID,

        value: "Capture a thought to your ALTERED brain."
    },

    CAPTURE_THOUGHT_ACTION_TRIGGER_PHRASE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "GWNNKoHreswKEp2RztEkm" as ALTEREDAttributeID,

        value: "c"
    },

    CAPTURE_THOUGHT_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "MrgenSlO514LFhANl4NEu" as ALTEREDAttributeID,

        value: "form"
    },

    SET_UP_SHORTCUTS_ACTION_ICON_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "b7RCNHUpCPr0LwYL_bMDf" as ALTEREDAttributeID,

        value: "cog-16"
    },

    SET_UP_SHORTCUTS_ACTION_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "CUG6_UMRqiCK-yixaYfB3" as ALTEREDAttributeID,

        value: "Set Up Shortcuts"
    },

    SET_UP_SHORTCUTS_ACTION_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "rqfoiRT3Sn6tIVP9NYg27" as ALTEREDAttributeID,

        value: "Set up Raycast Script Commands for ALTERED shortcuts."
    },

    SET_UP_SHORTCUTS_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "LVDmhg_-pf8z5rNX2wjM8" as ALTEREDAttributeID,

        value: "custom"
    },

    ALTERED_ONBOARDING_ACTION_ICON_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "aMjX6Dq3s9JPnFU3S68GV" as ALTEREDAttributeID,

        value: "info-01-16"
    },

    ALTERED_ONBOARDING_ACTION_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "3pDac6KDiK2yYsT0a25Wh" as ALTEREDAttributeID,

        value: "ALTERED Onboarding"
    },

    ALTERED_ONBOARDING_ACTION_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "DTw0lPD7pyuKb4W7x8JE3" as ALTEREDAttributeID,

        value: "Learn how set up and use your ALTERED brain."
    },

    ALTERED_ONBOARDING_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "dkZ21yNnSlJRtHlLrnuGF" as ALTEREDAttributeID,

        value: "markdown"
    },

    VIEW_THOUGHTS_ACTION_ICON_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "X2Innv4i8tLzqrNNloa8l" as ALTEREDAttributeID,

        value: "speech-bubble-16"
    },

    VIEW_THOUGHTS_ACTION_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "eBIb7Z2-4IuQMI6Sm1mlQ" as ALTEREDAttributeID,

        value: "View Thoughts"
    },

    VIEW_THOUGHTS_ACTION_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "oIhs_NFOTfDSbrUYwVmLP" as ALTEREDAttributeID,

        value: "View and manage the thoughts in your ALTERED brain."
    },

    VIEW_THOUGHTS_ACTION_TRIGGER_PHRASE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "ezrmfmF66CBtcyJsOcFGV" as ALTEREDAttributeID,

        value: "v"
    },

    VIEW_THOUGHTS_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "mw-TWoX3mMjZNw4p6Moo1" as ALTEREDAttributeID,

        value: "collection"
    },

    VIEW_THOUGHTS_INTERFACE_ITEMS_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "pyZAN3h5jVnBcEncx_8TN" as ALTEREDAttributeID,

        value: null
    },

    DISTILL_MESSAGE_TOOL_POC_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "isYxuDTstH8n3jJfsg79D" as ALTEREDAttributeID,

        value: "Distill Message Tool POC"
    },

    DISTILL_MESSAGE_TOOL_POC_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "NIp3VF4TkJaQyh4xgmR3P" as ALTEREDAttributeID,

        value: "Ingest user messages to their ALTERED brain via message distillation."
    },

    DISTILL_MESSAGE_TOOL_POC_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "5FwkqBF6VSXundk_ss4Ax" as ALTEREDAttributeID,

        value: "markdown"
    },

    QUERY_MEMORY_TOOL_POC_TITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "5WtGEYy8KKN8HS3OzDXWu" as ALTEREDAttributeID,

        value: "Query Memory Tool POC"
    },

    QUERY_MEMORY_TOOL_POC_SUBTITLE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "wh84qVgY4SApae-ANA_04" as ALTEREDAttributeID,

        value: "Fetch thoughts from the user's ALTERED brain for contextual memory queries."
    },

    QUERY_MEMORY_TOOL_POC_INTERFACE_TYPE_ATTRIBUTE: {
        // @spell-checker: disable-next-line
        id: "beV7eXPAmh5NkMB23jej_" as ALTEREDAttributeID,

        value: "markdown"
    }
} as const satisfies Record<string, ALTEREDAttributeDefinition>

const BUILTIN_ATTRIBUTES = Object.values(BUILTIN_ATTRIBUTES_MAP)

export { BUILTIN_ATTRIBUTES, BUILTIN_ATTRIBUTES_MAP }
