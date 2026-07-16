import {
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { thoughts } from "../../thoughts/storage/schema"

const tags = pgTable(
    "tags",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        thoughtId: text()
            .notNull()
            .references(() => thoughts.id, { onDelete: "cascade" }),

        /**
         * @todo P2: Decide if internal keywords should be case sensitive or insensitive long-term.
         */
        keyword: text().notNull(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
    },
    table => [
        uniqueIndex().on(table.thoughtId, table.keyword),
        index().on(table.keyword)
    ]
)

type Tag = typeof tags.$inferSelect

export { type Tag, tags }
