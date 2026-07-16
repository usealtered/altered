import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

const datasets = pgTable(
    "datasets",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        brainId: text(),

        alias: text().notNull(),
        content: text(),

        isSystem: boolean().notNull().default(false),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index().on(table.brainId, table.createdAt),
        uniqueIndex().on(table.brainId, table.alias)
    ]
)

type Dataset = typeof datasets.$inferSelect

export { type Dataset, datasets }
