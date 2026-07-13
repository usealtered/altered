import type {
    ALTEREDSchemaDefinition,
    ALTEREDSchemaID
} from "../../../models/schemas/definitions"

const BUILTIN_SCHEMAS_MAP = {
    ACTION_INTERFACE_ID_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "8SK5oehs7mP5ZJjnB5fHR" as ALTEREDSchemaID,

        type: "text"
    },

    INTERFACE_TYPE_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "PaViBZDzoFqEbtk1B0RlX" as ALTEREDSchemaID,

        type: "text"
    },

    COLLECTION_INTERFACE_ITEM_GROUPS_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "KVGqP0ElWC0CdpPczwSGK" as ALTEREDSchemaID,

        type: "thought-collection"
    },

    COLLECTION_INTERFACE_ITEM_GROUP_TITLE_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "cuG7ldURv_Q3ZKaOR5Ztx" as ALTEREDSchemaID,

        type: "text"
    },

    COLLECTION_INTERFACE_ITEM_GROUP_SUBTITLE_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "3Z23Zz_OESVyF1sx00iPh" as ALTEREDSchemaID,

        type: "text"
    },

    COLLECTION_INTERFACE_ITEMS_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "Aes-0nNMM1bojYqrJb0mx" as ALTEREDSchemaID,

        type: "dataset"
    },

    COLLECTION_INTERFACE_ITEM_ICON_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "9NNiHkGc_uDPVkWXv71Nt" as ALTEREDSchemaID,

        type: "text"
    },

    COLLECTION_INTERFACE_ITEM_TITLE_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "mPUXn0NVGmo_StvPSzjrA" as ALTEREDSchemaID,

        type: "text"
    },

    COLLECTION_INTERFACE_ITEM_SUBTITLE_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "y74HiQ_qRBa487R8x6okT" as ALTEREDSchemaID,

        type: "text"
    },

    COLLECTION_INTERFACE_ITEM_TRIGGER_PHRASE_SCHEMA: {
        // @spell-checker: disable-next-line
        id: "hL4f1fyRtKmMeW7LM2Qd4" as ALTEREDSchemaID,

        type: "text"
    }
} as const satisfies Record<string, ALTEREDSchemaDefinition>

const BUILTIN_SCHEMAS = Object.values(BUILTIN_SCHEMAS_MAP)

export { BUILTIN_SCHEMAS, BUILTIN_SCHEMAS_MAP }
