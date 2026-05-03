import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { conversations } from "../conversations/schema"

const MESSAGE_ROLES = ["system", "user", "assistant", "tool"] as const
type MessageRole = (typeof MESSAGE_ROLES)[number]

/**
 * @todo P0: Replace `unknown` in `parts` and `attachments` with AI SDK types.
 */
const messages = pgTable(
    "chat_messages",
    {
        id: text()
            .primaryKey()
            .notNull()
            .$defaultFn(() => nanoid()),

        userId: text(),
        brainId: text(),
        conversationId: text()
            .notNull()
            .references(() => conversations.id, { onDelete: "cascade" }),

        role: text({ enum: MESSAGE_ROLES }).$type<MessageRole>().notNull(),
        parts: jsonb().$type<unknown[]>().notNull(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index().on(table.conversationId, table.createdAt),
        index().on(table.brainId)
    ]
)

export { MESSAGE_ROLES, type MessageRole, messages }
