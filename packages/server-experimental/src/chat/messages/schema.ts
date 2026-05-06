import type { ModelMessage } from "ai"
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { conversations } from "../conversations/schema"

type ChatMessageRole = ModelMessage["role"]
const CHAT_MESSAGE_ROLES = [
    "system",
    "user",
    "assistant",
    "tool"
] as const satisfies ChatMessageRole[]

type ChatMessageContent = ModelMessage["content"]

const chatMessages = pgTable(
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

        role: text({ enum: CHAT_MESSAGE_ROLES })
            .$type<ChatMessageRole>()
            .notNull(),
        content: jsonb().$type<ChatMessageContent>().notNull(),

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

type ChatMessage = typeof chatMessages.$inferSelect

export {
    CHAT_MESSAGE_ROLES,
    type ChatMessage,
    type ChatMessageContent,
    type ChatMessageRole,
    chatMessages
}
