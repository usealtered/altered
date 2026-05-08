import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import type { ProviderID } from "../providers/definitions"

const conversations = pgTable(
    "chat_conversations",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        userId: text(),
        brainId: text(),
        providerId: text().$type<ProviderID>().notNull(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index().on(table.userId, table.createdAt),
        index().on(table.brainId)
    ]
)

export { conversations }
