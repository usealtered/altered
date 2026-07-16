import {
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { thoughts } from "../../thoughts/storage/schema"

/**
 * @todo P2: Normalize with builtin types and format once Raycast branch lands.
 */
const ATTRIBUTE_VALUE_TYPES = ["text", "number", "reference"] as const

/**
 * @todo P2: Normalize with builtin types and format once Raycast branch lands.
 */
const ATTRIBUTE_REFERENCE_TYPES = ["chat-message", "thought"] as const

type AttributeValueType = (typeof ATTRIBUTE_VALUE_TYPES)[number]
type AttributeReferenceType = (typeof ATTRIBUTE_REFERENCE_TYPES)[number]

/**
 * @remarks Keys reserved by the derived-thought source-link contract. These could either become hardcoded 'Schema' types, or global application-level, validated builtin Schema constants used where needed.
 */
const DERIVED_ATTRIBUTE_KEYS = {
    source: "source",
    sourceStartPosition: "source-start-position",
    sourceEndPosition: "source-end-position"
} as const

const attributes = pgTable(
    "attributes",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        /**
         * @todo P3: Decide if we need references/foreign keys in our schema in addition to relations v2 - see Drizzle guide and recommendations. Might be useful for cascade deletes, etc.
         */
        thoughtId: text()
            .notNull()
            .references(() => thoughts.id, { onDelete: "cascade" }),

        key: text().notNull(),
        valueType: text({ enum: ATTRIBUTE_VALUE_TYPES })
            .$type<AttributeValueType>()
            .notNull(),

        /**
         * Stored as text for all value types.
         *
         * @remarks Numbers are decimal strings. References store the target id;
         * pair with {@link attributes.referenceType} when `valueType` is `reference`.
         */
        value: text().notNull(),

        referenceType: text({
            enum: ATTRIBUTE_REFERENCE_TYPES
        }).$type<AttributeReferenceType>(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        uniqueIndex().on(table.thoughtId, table.key),
        index().on(table.key)
    ]
)

type Attribute = typeof attributes.$inferSelect

export {
    ATTRIBUTE_REFERENCE_TYPES,
    ATTRIBUTE_VALUE_TYPES,
    type Attribute,
    type AttributeReferenceType,
    type AttributeValueType,
    attributes,
    DERIVED_ATTRIBUTE_KEYS
}
