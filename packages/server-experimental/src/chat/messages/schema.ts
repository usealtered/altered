import type { ModelMessage } from "ai"
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { conversations } from "../conversations/schema"

type MessageRole = ModelMessage["role"]
const MESSAGE_ROLES = [
    "system",
    "user",
    "assistant",
    "tool"
] as const satisfies MessageRole[]

type MessageContent = ModelMessage["content"]

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
        content: jsonb().$type<MessageContent>().notNull(),

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

export { MESSAGE_ROLES, type MessageContent, type MessageRole, messages }
