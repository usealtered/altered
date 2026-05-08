import { sql } from "drizzle-orm"
import {
    check,
    pgTable,
    text,
    timestamp,
    unique,
    uniqueIndex
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { conversations } from "../../../chat/conversations/schema"
import { chatMessages } from "../../../chat/messages/schema"
import type { ExternalResourceTypeID } from "./definitions"

const externalResources = pgTable(
    "external_resources",
    {
        id: text()
            .primaryKey()
            .notNull()
            .$defaultFn(() => nanoid()),

        conversationId: text().references(() => conversations.id, {
            onDelete: "cascade"
        }),
        messageId: text().references(() => chatMessages.id, {
            onDelete: "cascade"
        }),

        resourceTypeId: text().$type<ExternalResourceTypeID>().notNull(),
        referenceId: text().notNull(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        check(
            "external_resources_single_parent",
            sql`(case when ${table.conversationId} is not null then 1 else 0 end) + (case when ${table.messageId} is not null then 1 else 0 end) = 1`
        ),
        unique().on(table.resourceTypeId, table.referenceId),
        uniqueIndex()
            .on(table.conversationId, table.resourceTypeId)
            .where(sql`${table.conversationId} is not null`),
        uniqueIndex()
            .on(table.messageId, table.resourceTypeId)
            .where(sql`${table.messageId} is not null`)
    ]
)

export { externalResources }
